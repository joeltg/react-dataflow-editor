import { EnterElement, Selection } from "d3-selection"

import type {
	Schema,
	Node,
	Source,
	ReadonlyCanvasRef,
	GetOutputs,
} from "../interfaces.js"
import { defaultBackgroundColor, defaultBorderColor } from "../styles.js"
import { getPortOffsetY, portRadius } from "../utils.js"

export type Output<S extends Schema> = {
	index: number
	source: Source<S, keyof S>
	value: string[]
}

export const getOutputKey = <S extends Schema>({
	source: { output },
}: Output<S>): string => output

export const appendOutputPorts = <S extends Schema>(
	enter: Selection<EnterElement, Output<S>, SVGGElement, Node<S, keyof S>>
): Selection<SVGCircleElement, Output<S>, SVGGElement, Node<S, keyof S>> => {
	const circles = enter
		.append("circle")
		.classed("port", true)
		.attr("cx", 0)
		.attr("cy", ({ index }) => getPortOffsetY(index))
		.attr("r", portRadius)
		.attr("fill", defaultBackgroundColor)

	circles.append("title").text(getOutputKey).datum(null)
	return circles
}

export const getOutputs = <S extends Schema>(
	ref: ReadonlyCanvasRef<S>,
	node: Node<S>
) =>
	Object.keys(ref.kinds[node.kind].outputs).map(
		(output: GetOutputs<S, keyof S>, index) => ({
			index,
			source: { id: node.id, output },
			value: node.outputs[output],
		})
	)
