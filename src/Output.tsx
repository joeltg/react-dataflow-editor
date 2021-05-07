import React, { useCallback, useContext, useMemo } from "react"
import { select } from "d3-selection"
import { DragBehavior } from "d3-drag"

import type { Schema, GetOutputs, Focus, Kinds, Node } from "./state.js"

import {
	getOutputIndex,
	getPortOffsetY,
	nodeMarginX,
	portRadius,
	toTranslate,
} from "./utils.js"
import { OutputDragSubject } from "./outputDrag.js"
import { CanvasContext } from "./context.js"

export interface GraphOutputProps<S extends Schema, K extends keyof S> {
	kinds: Kinds<S>
	focus: Focus | null
	node: Node<S, K>
	output: GetOutputs<S, K>
	outputDrag?: DragBehavior<SVGCircleElement, unknown, OutputDragSubject<S>>
}

export function GraphOutput<S extends Schema, K extends keyof S>(
	props: GraphOutputProps<S, K>
) {
	const transform = useMemo(() => {
		const index = getOutputIndex(props.kinds, props.node.kind, props.output)
		const offsetY = getPortOffsetY(index)
		return toTranslate([0, offsetY])
	}, [])

	const context = useContext(CanvasContext)
	const { backgroundColor } = context.options

	const ref = useCallback((circle: SVGCircleElement | null) => {
		if (circle !== null && props.outputDrag) {
			select(circle).call(props.outputDrag)
		}
	}, [])

	const values: string[] = props.node.outputs[props.output]
	const isFocused =
		props.focus !== null &&
		props.focus.element === "edge" &&
		values.includes(props.focus.id)

	return (
		<g
			className={isFocused ? "output focus" : "output"}
			data-id={props.node.id}
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
				fill={backgroundColor}
				r={portRadius}
			/>
		</g>
	)
}
