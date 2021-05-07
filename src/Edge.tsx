import React, { useCallback, useContext, useMemo } from "react"
import type { Schema, Kinds, Node, Edge, Focus } from "./state.js"

import {
	getInputOffset,
	getOutputOffset,
	makeCurvePath,
	place,
} from "./utils.js"
import { CanvasContext } from "./context.js"

export interface GraphEdgeProps<S extends Schema> {
	kinds: Kinds<S>
	nodes: Record<string, Node<S>>
	focus: Focus | null
	edge: Edge<S>
}

export function GraphEdge<S extends Schema>(props: GraphEdgeProps<S>) {
	const { kinds, nodes, edge } = props
	const source = nodes[edge.source.id]
	const target = nodes[edge.target.id]

	const context = useContext(CanvasContext)

	const sourcePosition = useMemo(() => {
		const offset = getOutputOffset(kinds, source.kind, edge.source.output)
		return place(context, source.position, offset)
	}, [edge.source, source.position])

	const targetPosition = useMemo(() => {
		const offset = getInputOffset(kinds, target.kind, edge.target.input)
		return place(context, target.position, offset)
	}, [edge.target, target.position])

	const path = useMemo(() => makeCurvePath(sourcePosition, targetPosition), [
		sourcePosition,
		targetPosition,
	])

	const handleClick = useCallback((event: React.MouseEvent<SVGGElement>) => {
		context.onFocus({ element: "edge", id: props.edge.id })
	}, [])

	const { borderColor, backgroundColor } = context.options

	const isFocused =
		props.focus !== null &&
		props.focus.element === "edge" &&
		props.focus.id === props.edge.id

	return (
		<g
			className={isFocused ? "edge focus" : "edge"}
			strokeWidth={isFocused ? 12 : 8}
			data-id={edge.id}
			data-source-id={edge.source.id}
			data-source-kind={source.kind}
			data-source-output={edge.source.output}
			data-target-id={edge.target.id}
			data-target-kind={target.kind}
			data-target-input={edge.target.input}
			cursor="pointer"
			onClick={handleClick}
		>
			<path stroke={borderColor} fill="none" d={path} />
			<path strokeWidth={6} stroke={backgroundColor} fill="none" d={path} />
		</g>
	)
}
