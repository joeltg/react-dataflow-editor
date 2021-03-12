import React, {
	useCallback,
	useContext,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
} from "react"

import { useDrop } from "react-dnd"

import { select } from "d3-selection"

import * as actions from "./redux/actions.js"

import { Graph, CanvasRef, Blocks, Schema } from "./interfaces.js"

import { attachPreview } from "./preview.js"
import { updateNodes } from "./nodes.js"
import { updateEdges } from "./edges.js"
import { snap } from "./utils.js"
import {
	defaultBackgroundColor,
	defaultBorderColor,
	StyleContext,
} from "./styles.js"

const SVG_STYLE = `
g.node circle.port { cursor: grab }
g.node circle.port.hidden { display: none }
g.node > g.outputs > circle.port.dragging { cursor: grabbing }

g.node:focus > path { stroke-width: 3 }

g.edge.hidden { display: none }
g.edge > path.curve {
	stroke: gray;
	stroke-width: 6px;
	fill: none;
}

g.preview.hidden { display: none }
g.preview > path.curve {
	stroke: gray;
	stroke-width: 6px;
	fill: none;
	stroke-dasharray: 8 6;
}
g.preview > circle {
	fill: ${defaultBackgroundColor};
	stroke: ${defaultBorderColor};
	stroke-width: 4px;
}
`

export interface CanvasProps<S extends Schema> {
	unit: number
	blocks: Blocks<S>
	graph: Graph<S>
	dispatch: (action: actions.EditorAction<S>) => void
}

export function Canvas<S extends Schema>(props: CanvasProps<S>) {
	const dimensions = useRef<[number, number]>([Infinity, Infinity])

	const ref = useMemo<CanvasRef<S>>(
		() => ({
			nodes: select<SVGGElement | null, unknown>(null),
			edges: select<SVGGElement | null, unknown>(null),
			preview: select<SVGGElement | null, unknown>(null),
			unit: props.unit,
			dimensions: dimensions.current,
			blocks: props.blocks,
			graph: props.graph,
			dispatch: props.dispatch,
		}),
		[]
	)

	ref.graph = props.graph

	const svgRef = useRef<SVGSVGElement | null>(null)

	useEffect(() => {
		const svg = svgRef.current
		if (svg !== null) {
			const observer = new ResizeObserver((entries: ResizeObserverEntry[]) => {
				for (const entry of entries) {
					if (entry.target === svg) {
						const { width, height } = entry.contentRect
						ref.dimensions = [width, height]
					}
				}
			})
			observer.observe(svg)
			return () => observer.unobserve(svg)
		}
	}, [svgRef.current])

	const nodesRef = useCallback((nodes: SVGGElement) => {
		ref.nodes = select<SVGGElement | null, unknown>(nodes)
	}, [])

	const edgesRef = useCallback((edges: SVGGElement) => {
		ref.edges = select<SVGGElement | null, unknown>(edges)
	}, [])

	const previewRef = useCallback((preview: SVGGElement) => {
		ref.preview = select<SVGGElement | null, unknown>(preview)
		ref.preview.call(attachPreview)
	}, [])

	const update = useMemo(
		() => ({ nodes: updateNodes(ref), edges: updateEdges(ref) }),
		[]
	)

	useLayoutEffect(() => void update.nodes(), [props.graph.nodes])
	useLayoutEffect(() => void update.edges(), [
		props.graph.edges,
		props.graph.nodes,
	])

	const [{}, drop] = useDrop<{ type: "block"; kind: keyof S }, void, {}>({
		accept: ["block"],
		drop({ kind }, monitor) {
			const { x, y } = monitor.getSourceClientOffset()!
			const { left, top } = svgRef.current!.getBoundingClientRect()
			const position = snap([x - left, y - top], props.unit, dimensions.current)
			props.dispatch(actions.createNode(kind, position))
		},
	})

	const style = useContext(StyleContext)

	const { svgStyle, canvasStyle } = useMemo(
		() => ({
			canvasStyle: style.getCanvasStyle(props),
			svgStyle: style.getSVGStyle(props),
		}),
		[props.unit]
	)

	const x = useMemo(
		() =>
			480 +
			props.unit *
				Object.values(props.graph.nodes).reduce(
					(x, { position }) => Math.max(x, position.x),
					0
				),
		[props.graph.nodes]
	)

	return (
		<div ref={drop} className="canvas" style={canvasStyle}>
			<svg
				ref={svgRef}
				xmlns="http://www.w3.org/2000/svg"
				style={{ ...svgStyle, minWidth: x }}
			>
				<style>{SVG_STYLE}</style>
				<g className="edges" ref={edgesRef}></g>
				<g className="nodes" ref={nodesRef}></g>
				<g className="preview" ref={previewRef}></g>
			</svg>
		</div>
	)
}
