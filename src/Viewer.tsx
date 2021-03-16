import React, {
	useCallback,
	useContext,
	useLayoutEffect,
	useMemo,
	useRef,
} from "react"

import { select, Selection } from "d3-selection"

import { updateNodes } from "./nodes/readonly.js"
import { updateEdges } from "./edges.js"

import {
	Blocks,
	Edge,
	Graph,
	Node,
	ReadonlyCanvasRef,
	Schema,
} from "./interfaces.js"
import { defaultCanvasUnit, defaultCanvasHeight, SVG_STYLE } from "./utils.js"
import { StyleContext } from "./styles.js"

export interface ViewerProps<S extends Schema> {
	unit?: number
	height?: number
	blocks: Blocks<S>
	graph: Graph<S>
	onFocus: (id: string | null) => void
	decorateNodes?: (
		nodes: Selection<SVGGElement, Node<S>, SVGGElement | null, unknown>
	) => void
	decorateEdges?: (
		edges: Selection<SVGGElement, Edge<S>, SVGGElement | null, unknown>
	) => void
}

export function Viewer<S extends Schema>({
	unit = defaultCanvasUnit,
	height = defaultCanvasHeight,
	...props
}: ViewerProps<S>) {
	return (
		<div className="viewer">
			<Canvas
				unit={unit}
				height={height}
				blocks={props.blocks}
				graph={props.graph}
				onFocus={props.onFocus}
				decorateEdges={props.decorateEdges}
				decorateNodes={props.decorateNodes}
			/>
		</div>
	)
}

interface CanvasProps<S extends Schema> {
	unit: number
	height: number
	blocks: Blocks<S>
	graph: Graph<S>
	onFocus?: (id: string | null) => void
	decorateNodes?: (
		nodes: Selection<SVGGElement, Node<S>, SVGGElement | null, unknown>
	) => void
	decorateEdges?: (
		edges: Selection<SVGGElement, Edge<S>, SVGGElement | null, unknown>
	) => void
}

function Canvas<S extends Schema>(props: CanvasProps<S>) {
	const ref = useMemo<ReadonlyCanvasRef<S>>(
		() => ({
			nodes: select<SVGGElement | null, unknown>(null),
			edges: select<SVGGElement | null, unknown>(null),
			unit: props.unit,
			height: props.height,
			blocks: props.blocks,
			graph: props.graph,
			onFocus: props.onFocus,
			decorateEdges: props.decorateEdges,
			decorateNodes: props.decorateNodes,
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

	const update = useMemo(
		() => ({ nodes: updateNodes(ref), edges: updateEdges(ref) }),
		[]
	)

	useLayoutEffect(() => void update.nodes(), [props.graph.nodes])
	useLayoutEffect(() => void update.edges(), [
		props.graph.edges,
		props.graph.nodes,
	])

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
		<div className="canvas" style={canvasStyle}>
			<svg
				ref={svgRef}
				xmlns="http://www.w3.org/2000/svg"
				style={{ ...svgStyle, minWidth: x }}
				height={height}
			>
				<style>{SVG_STYLE}</style>
				<g className="edges" ref={edgesRef}></g>
				<g className="nodes" ref={nodesRef}></g>
			</svg>
		</div>
	)
}
