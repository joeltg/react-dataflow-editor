import React, { useCallback, useContext, useMemo } from "react"

import type { EditorState, Kinds, Schema } from "../state.js"
import { FocusAction } from "../actions.js"

import { GraphNode } from "../Node.js"
import { GraphEdge } from "../Edge.js"

import { CanvasContext } from "../context.js"
import { useStyles } from "../styles.js"
import { getCanvasWidth } from "../utils.js"

export interface ReadonlyCanvasProps<S extends Schema> {
	kinds: Kinds<S>
	state: EditorState<S>
	dispatch: (action: FocusAction) => void
}

export function Canvas<S extends Schema>(props: ReadonlyCanvasProps<S>) {
	const context = useContext(CanvasContext)

	const styles = useStyles()

	const width = useMemo(() => {
		return getCanvasWidth(context, props.state.nodes)
	}, [props.state.nodes])

	const handleBackgroundClick = useCallback(
		(_: React.MouseEvent<SVGRectElement>) => {
			context.onFocus(null)
		},
		[]
	)

	const { borderColor, unit, height } = context.options
	const borderWidth = props.state.focus === null ? 1 : 0
	const boxShadow = `0 0 0 ${borderWidth}px ${borderColor}`

	return (
		<div className="canvas" style={{ ...styles.canvas, boxShadow }}>
			<svg
				ref={context.svgRef}
				xmlns="http://www.w3.org/2000/svg"
				style={{ ...styles.svg, minWidth: width }}
				height={unit * height}
			>
				<rect
					className="background"
					fill="transparent"
					height={unit * height}
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
