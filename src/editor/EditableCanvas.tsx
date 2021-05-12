import React, { useCallback, useContext, useMemo } from "react"

import { useDrop } from "react-dnd"

import type { EditorState, Kinds, Schema } from "../state.js"
import { createNode, deleteNode, EditorAction } from "../actions.js"

import { GraphNode } from "../Node.js"
import { GraphEdge } from "../Edge.js"
import { makeInputDragBehavior } from "../inputDrag.js"
import { makeOutputDragBehavior } from "../outputDrag.js"
import { makeNodeDragBehavior } from "../nodeDrag.js"

import { getCanvasWidth, nodeWidth, portRadius, snap } from "../utils.js"
import { CanvasContext } from "../context.js"
import { useStyles } from "../styles.js"

export interface CanvasProps<S extends Schema> {
	kinds: Kinds<S>
	state: EditorState<S>
	dispatch: (action: EditorAction<S>) => void
}

export function Canvas<S extends Schema>(props: CanvasProps<S>) {
	const context = useContext(CanvasContext)

	const [{}, drop] = useDrop<{ kind: keyof S }, void, {}>({
		accept: ["node"],
		drop({ kind }, monitor) {
			const { x, y } = monitor.getSourceClientOffset()!
			const { left, top } = context.svgRef.current!.getBoundingClientRect()
			const position = snap(context, [x - left, y - top])
			props.dispatch(createNode(kind, position))
		},
	})

	const styles = useStyles()

	const width = useMemo(() => {
		return getCanvasWidth(context, props.state.nodes)
	}, [props.state.nodes])

	const nodeDrag = useMemo(() => {
		return makeNodeDragBehavior(context, props.kinds, props.dispatch)
	}, [])

	const inputDrag = useMemo(() => {
		return makeInputDragBehavior(context, props.kinds, props.dispatch)
	}, [])

	const outputDrag = useMemo(() => {
		return makeOutputDragBehavior(context, props.kinds, props.dispatch)
	}, [])

	const handleBackgroundClick = useCallback(
		(event: React.MouseEvent<SVGRectElement>) => {
			context.onFocus(null)
		},
		[]
	)

	const { borderColor, backgroundColor, unit, height } = context.options
	const borderWidth = props.state.focus === null ? 1 : 0
	const boxShadow = `0 0 0 ${borderWidth}px ${borderColor}`

	return (
		<div ref={drop} className="canvas" style={{ ...styles.canvas, boxShadow }}>
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
							nodeDrag={nodeDrag}
							inputDrag={inputDrag}
							outputDrag={outputDrag}
						>
							<text
								stroke="none"
								fill={borderColor}
								x={nodeWidth - 20}
								y={18}
								cursor="pointer"
								onClick={() => props.dispatch(deleteNode(node.id))}
							>
								𝖷
							</text>
						</GraphNode>
					))}
				</g>
				<g
					className="preview"
					ref={context.previewRef}
					display="none"
					stroke={borderColor}
					cursor="grabbing"
					fill={backgroundColor}
				>
					<path strokeWidth={6} fill="none" strokeDasharray="8 6" />
					<circle className="source" r={portRadius} strokeWidth={4} />
					<circle className="target" r={portRadius} strokeWidth={4} />
				</g>
			</svg>
		</div>
	)
}
