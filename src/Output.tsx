import React, { useCallback, useMemo } from "react"
import { select } from "d3-selection"
import { DragBehavior } from "d3-drag"

import type { Schema, GetOutputs, Focus } from "./state.js"
import { defaultBackgroundColor } from "./styles.js"
import {
	getPortOffsetY,
	nodeMarginX,
	portRadius,
	toTranslate,
} from "./utils.js"
import { OutputDragSubject } from "./outputDrag.js"

export interface GraphOutputProps<S extends Schema> {
	focus: Focus | null
	outputDrag?: DragBehavior<SVGCircleElement, unknown, OutputDragSubject<S>>
	id: string
	output: GetOutputs<S>
	index: number
	values: string[]
}

export function GraphOutput<S extends Schema>(props: GraphOutputProps<S>) {
	const transform = toTranslate([0, getPortOffsetY(props.index)])

	const ref = useCallback((circle: SVGCircleElement | null) => {
		if (circle !== null && props.outputDrag) {
			select(circle).call(props.outputDrag)
		}
	}, [])

	const isFocused =
		props.focus !== null &&
		props.focus.element === "edge" &&
		props.values.includes(props.focus.id)

	return (
		<g
			className={isFocused ? "output focus" : "output"}
			data-id={props.id}
			data-output={props.output}
			transform={transform}
			strokeWidth={isFocused ? 3 : undefined}
		>
			<text
				textAnchor="end"
				stroke="none"
				x={-portRadius - nodeMarginX}
				dominantBaseline="middle"
			>
				{props.output}
			</text>
			<circle
				ref={ref}
				className="port"
				cursor="grab"
				fill={defaultBackgroundColor}
				r={portRadius}
			/>
		</g>
	)
}
