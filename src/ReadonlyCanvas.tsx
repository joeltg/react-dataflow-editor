import React, { useCallback, useContext, useMemo } from "react"

import type { EditorState, Kinds, Schema } from "./state.js"
import { FocusAction } from "./actions.js"

import { GraphNode } from "./Node.js"
import { GraphEdge } from "./Edge.js"

import { EditorContext } from "./context.js"
import { borderColor, StyleContext } from "./styles.js"

export interface ReadonlyCanvasProps<S extends Schema> {
	kinds: Kinds<S>
	state: EditorState<S>
	dispatch: (action: FocusAction) => void
}

export function Canvas<S extends Schema>(props: ReadonlyCanvasProps<S>) {
	const context = useContext(EditorContext)

	const style = useContext(StyleContext)

	const { svgStyle, canvasStyle } = useMemo(
		() => ({
			canvasStyle: style.getCanvasStyle(context),
			svgStyle: style.getSVGStyle(context),
		}),
		[]
	)

	const width = useMemo(
		() =>
			480 +
			context.unit *
				Object.values(props.state.nodes).reduce(
					(x, { position }) => Math.max(x, position.x),
					0
				),
		[props.state.nodes]
	)

	const handleBackgroundClick = useCallback(
		(event: React.MouseEvent<SVGRectElement>) => {
			context.onFocus(null)
		},
		[]
	)

	const borderWidth = props.state.focus === null ? 1 : 0
	const boxShadow = `inset 0 0 0 ${borderWidth}px ${borderColor}`

	return (
		<div className="canvas" style={{ ...canvasStyle, boxShadow }}>
			<svg
				ref={context.svgRef}
				xmlns="http://www.w3.org/2000/svg"
				style={{ ...svgStyle, minWidth: width, userSelect: "none" }}
				height={context.unit * context.height}
			>
				<rect
					className="background"
					fill="transparent"
					height={context.unit * context.height}
					style={{ minWidth: width, width: "100%" }}
					onClick={handleBackgroundClick}
				/>
				<g className="edges" ref={context.edgesRef}>
					{Object.values(props.state.edges).map((edge) => (
						<GraphEdge<S>
							key={edge.id}
							kinds={props.kinds}
							nodes={props.state.nodes}
							focus={props.state.focus}
							edge={edge}
						/>
					))}
				</g>
				<g className="nodes" ref={context.nodesRef}>
					{Object.values(props.state.nodes).map((node) => (
						<GraphNode<S>
							key={node.id}
							kinds={props.kinds}
							focus={props.state.focus}
							node={node}
						/>
					))}
				</g>
			</svg>
		</div>
	)
}
