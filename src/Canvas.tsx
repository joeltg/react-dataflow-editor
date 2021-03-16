import React, {
	useCallback,
	useContext,
	useLayoutEffect,
	useMemo,
	useRef,
} from "react"

import { useDrop } from "react-dnd"

import { select } from "d3-selection"

import * as actions from "./redux/actions.js"

import { Graph, CanvasRef, Blocks, Schema } from "./interfaces.js"

import { attachPreview } from "./preview.js"
import { updateNodes } from "./nodes/editable.js"
import { updateEdges } from "./edges.js"
import { snap, SVG_STYLE } from "./utils.js"
import { StyleContext } from "./styles.js"

export interface CanvasProps<S extends Schema> {
	unit: number
	height: number
	blocks: Blocks<S>
	graph: Graph<S>
	onFocus?: (id: string | null) => void
	dispatch: (action: actions.EditorAction<S>) => void
}

export function Canvas<S extends Schema>(props: CanvasProps<S>) {
	const ref = useMemo<CanvasRef<S>>(
		() => ({
			nodes: select<SVGGElement | null, unknown>(null),
			edges: select<SVGGElement | null, unknown>(null),
			preview: select<SVGGElement | null, unknown>(null),
			unit: props.unit,
			height: props.height,
			blocks: props.blocks,
			graph: props.graph,
			dispatch: props.dispatch,
		}),
		[]
	)

	ref.graph = props.graph

	const svgRef = useRef<SVGSVGElement | null>(null)

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
			const position = snap(ref, [x - left, y - top])
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

	const height = props.unit * props.height

	return (
		<div ref={drop} className="canvas" style={canvasStyle}>
			<svg
				ref={svgRef}
				xmlns="http://www.w3.org/2000/svg"
				style={{ ...svgStyle, minWidth: x }}
				height={height}
			>
				<style>{SVG_STYLE}</style>
				<g className="edges" ref={edgesRef}></g>
				<g className="nodes" ref={nodesRef}></g>
				<g className="preview" ref={previewRef}></g>
			</svg>
		</div>
	)
}
