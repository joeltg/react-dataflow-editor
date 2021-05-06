import React, { useCallback, useContext, useMemo } from "react"

import { select } from "d3-selection"
import { DragBehavior } from "d3-drag"

import type { Focus, GetInputs, Schema } from "./state.js"

import { InputDragSubject } from "./inputDrag.js"
import { defaultBackgroundColor } from "./styles.js"
import { EditorContext } from "./context.js"

import {
	getPortOffsetY,
	nodeMarginX,
	portRadius,
	toTranslate,
} from "./utils.js"

export interface GraphInputProps<S extends Schema> {
	focus: Focus | null
	inputDrag?: DragBehavior<SVGCircleElement, unknown, InputDragSubject<S>>
	id: string
	input: GetInputs<S>
	index: number
	value: string | null
}

export function GraphInput<S extends Schema>(props: GraphInputProps<S>) {
	const transform = toTranslate([0, getPortOffsetY(props.index)])

	const context = useContext(EditorContext)

	const ref = useCallback((circle: SVGCircleElement | null) => {
		if (circle !== null && props.inputDrag) {
			select(circle).call(props.inputDrag)
		}
	}, [])

	const handleClick = useCallback(
		(event: React.MouseEvent<SVGCircleElement>) => {
			event.stopPropagation()
			if (props.value !== null) {
				context.onFocus({ element: "edge", id: props.value })
			}
		},
		[props.value]
	)

	const isFocused =
		props.focus !== null &&
		props.focus.element === "edge" &&
		props.focus.id === props.value

	return (
		<g
			className={isFocused ? "input focus" : "input"}
			data-id={props.id}
			data-input={props.input}
			data-value={props.value}
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
				display={props.value === null ? "none" : "inherit"}
				fill={defaultBackgroundColor}
				r={portRadius}
				onClick={handleClick}
			/>
		</g>
	)
}
