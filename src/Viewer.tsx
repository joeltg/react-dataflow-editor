export {}
// import { select } from "d3-selection"
// import React, {
// 	useCallback,
// 	useContext,
// 	useEffect,
// 	useMemo,
// 	useRef,
// } from "react"

// import { Blocks, Graph, Schema } from "./interfaces.js"
// import { EditorAction } from "./redux/actions.js"
// import { StyleContext } from "./styles.js"
// import { defaultCanvasUnit, defaultCanvasDimensions } from "./utils.js"

// export interface EditorProps<S extends Schema> {
// 	unit?: number
// 	blocks: Blocks<S>
// 	graph: Graph<S>
// 	onFocus: (id: string | null) => void
// }

// export function Editor<S extends Schema>(props: EditorProps<S>) {
// 	return (
// 		<div className="viewer">
// 			<Canvas<S>
// 				unit={props.unit || defaultCanvasUnit}
// 				blocks={props.blocks}
// 				graph={props.graph}
// 				onFocus={props.onFocus}
// 			/>
// 		</div>
// 	)
// }

// interface CanvasProps<S extends Schema> {
// 	unit: number
// 	blocks: Blocks<S>
// 	graph: Graph<S>
// 	onFocus?: (id: string | null) => void
// }

// function Canvas<S extends Schema>(props: CanvasProps<S>) {
// 	const svgRef = useRef<SVGSVGElement | null>(null)

// 	const nodesRef = useCallback((nodes: SVGGElement) => {
// 		ref.nodes = select<SVGGElement | null, unknown>(nodes)
// 	}, [])

// 	const edgesRef = useCallback((edges: SVGGElement) => {
// 		ref.edges = select<SVGGElement | null, unknown>(edges)
// 	}, [])

// 	const previewRef = useCallback((preview: SVGGElement) => {
// 		ref.preview = select<SVGGElement | null, unknown>(preview)
// 		ref.preview.call(attachPreview)
// 	}, [])

// 	useLayoutEffect(() => void update.nodes(), [props.graph.nodes])
// 	useLayoutEffect(() => void update.edges(), [
// 		props.graph.edges,
// 		props.graph.nodes,
// 	])

// 	const style = useContext(StyleContext)

// 	const { svgStyle, canvasStyle } = useMemo(
// 		() => ({
// 			canvasStyle: style.getCanvasStyle(props),
// 			svgStyle: style.getSVGStyle(props),
// 		}),
// 		[props.unit]
// 	)

// 	const x = useMemo(
// 		() =>
// 			480 +
// 			props.unit *
// 				Object.values(props.graph.nodes).reduce(
// 					(x, { position }) => Math.max(x, position.x),
// 					0
// 				),
// 		[props.graph.nodes]
// 	)

// 	return (
// 		<div className="canvas" style={canvasStyle}>
// 			<svg
// 				ref={svgRef}
// 				xmlns="http://www.w3.org/2000/svg"
// 				style={{ ...svgStyle, minWidth: x }}
// 			>
// 				<style>{SVG_STYLE}</style>
// 				<g className="edges" ref={edgesRef}></g>
// 				<g className="nodes" ref={nodesRef}></g>
// 			</svg>
// 		</div>
// 	)
// }
