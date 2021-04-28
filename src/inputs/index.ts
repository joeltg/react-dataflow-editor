import { EnterElement, Selection } from "d3-selection"

import type {
	GetInputs,
	Node,
	ReadonlyCanvasRef,
	Schema,
	Target,
} from "../interfaces.js"
import { getPortOffsetY, portRadius } from "../utils.js"
import { defaultBackgroundColor, defaultBorderColor } from "../styles.js"

export type Input<S extends Schema> = {
	index: number
	target: Target<S, keyof S>
	value: string | null
}

export const getInputKey = <S extends Schema>({
	target: { input },
}: Input<S>): string => input

export const appendInputPorts = <S extends Schema>(
	enter: Selection<EnterElement, Input<S>, SVGGElement, Node<S, keyof S>>
): Selection<SVGCircleElement, Input<S>, SVGGElement, Node<S, keyof S>> => {
	const circles = enter
		.append("circle")
		.classed("port", true)
		.classed("hidden", ({ value }) => value === null)
		.attr("cx", 0)
		.attr("cy", ({ index }) => getPortOffsetY(index))
		.attr("r", portRadius)
		.attr("fill", defaultBackgroundColor)
		// .attr("stroke", "inherit")
		.attr("data-input", ({ target: { input } }) => input)
		.attr("data-value", ({ value }) => value)

	circles.append("title").text(getInputKey).datum(null)
	return circles
}

export const getInputs = <S extends Schema>(
	ref: ReadonlyCanvasRef<S>,
	node: Node<S>
): Input<S>[] =>
	Object.keys(ref.kinds[node.kind].inputs).map(
		(input: GetInputs<S, keyof S>, index) => {
			const value: null | string = node.inputs[input]
			const target: Target<S, keyof S> = { id: node.id, input }
			return { index, target, value }
		}
	)
