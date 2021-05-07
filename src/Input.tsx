import React, { useCallback, useContext, useMemo } from "react"

import { select } from "d3-selection"
import { DragBehavior } from "d3-drag"

import type { Focus, GetInputs, Kinds, Node, Schema } from "./state.js"

import { InputDragSubject } from "./inputDrag.js"

import { CanvasContext } from "./context.js"

import {
	getInputIndex,
	getPortOffsetY,
	nodeMarginX,
	portRadius,
	toTranslate,
} from "./utils.js"

export interface GraphInputProps<S extends Schema, K extends keyof S> {
	kinds: Kinds<S>
	focus: Focus | null
	node: Node<S, K>
	input: GetInputs<S, K>
	inputDrag?: DragBehavior<SVGCircleElement, unknown, InputDragSubject<S>>
}

export function GraphInput<S extends Schema, K extends keyof S>(
	props: GraphInputProps<S, K>
) {
	const transform = useMemo(() => {
		const index = getInputIndex(props.kinds, props.node.kind, props.input)
		const offsetY = getPortOffsetY(index)
		return toTranslate([0, offsetY])
	}, [])

	const context = useContext(CanvasContext)
	const { backgroundColor } = context.options

	const ref = useCallback((circle: SVGCircleElement | null) => {
		if (circle !== null && props.inputDrag) {
			select(circle).call(props.inputDrag)
		}
	}, [])

	const value: string | null = props.node.inputs[props.input]
	const handleClick = useCallback(
		(event: React.MouseEvent<SVGCircleElement>) => {
			event.stopPropagation()
			if (value !== null) {
				context.onFocus({ element: "edge", id: value })
			}
		},
		[value]
	)

	const isFocused =
		props.focus !== null &&
		props.focus.element === "edge" &&
		props.focus.id === value

	return (
		<g
			className={isFocused ? "input focus" : "input"}
			data-id={props.node.id}
			data-input={props.input}
			data-value={value}
			transform={transform}
			strokeWidth={isFocused ? 3 : undefined}
		>
			<text
				stroke="none"
				x={portRadius + nodeMarginX}
				dominantBaseline="middle"
			>
				{props.input}
			</text>
			<circle
				ref={ref}
				className="port"
				cursor="grab"
				display={value === null ? "none" : "inherit"}
				fill={backgroundColor}
				r={portRadius}
				onClick={handleClick}
			/>
		</g>
	)
}
