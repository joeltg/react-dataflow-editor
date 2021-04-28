import { Selection, EnterElement } from "d3-selection"

import type { Schema, Node, ReadonlyCanvasRef } from "../interfaces.js"
import { defaultBorderColor, getBackgroundColor } from "../styles.js"
import {
	AttachPorts,
	nodeHeaderHeight,
	nodeWidth,
	getKey,
	makeClipPath,
	portHeight,
	toTranslate,
} from "../utils.js"

export const appendNodes = <S extends Schema>(
	ref: ReadonlyCanvasRef<S>,
	enter: Selection<EnterElement, Node<S, keyof S>, SVGGElement | null, unknown>,
	attachInputs: AttachPorts<S>,
	attachOutputs: AttachPorts<S>
) => {
	const groups = enter
		.append("g")
		.classed("node", true)
		.attr("data-id", getKey)
		.attr("tabindex", 0)
		.attr("transform", ({ position: { x, y } }) =>
			toTranslate(x * ref.unit, y * ref.unit)
		)
		.attr("stroke", defaultBorderColor)
		.attr("stroke-width", 1)

	groups
		.append("path")
		.attr("fill", getBackgroundColor(ref.kinds))
		.attr("d", function ({ kind }) {
			const { inputs, outputs } = ref.kinds[kind]
			const { length: inputCount } = Object.keys(inputs)
			const { length: outputCount } = Object.keys(outputs)

			const w = nodeWidth
			const h =
				nodeHeaderHeight + portHeight * Math.max(inputCount, outputCount)
			return makeClipPath(inputCount, [w, h])
		})

	groups
		.append("text")
		.classed("title", true)
		.attr("stroke", "none")
		.attr("x", 8)
		.attr("y", 18)
		.attr("font-size", 16)
		.text(({ kind }) => ref.kinds[kind].name)

	groups
		.append("line")
		.attr("stroke", "dimgrey")
		.attr("stroke-width", 1)
		.attr("x1", 4)
		.attr("y1", nodeHeaderHeight)
		.attr("x2", nodeWidth - 4)
		.attr("y2", nodeHeaderHeight)

	groups.append("g").classed("inputs", true).call(attachInputs)

	groups
		.append("g")
		.classed("outputs", true)
		.attr("transform", toTranslate(nodeWidth, 0))
		.call(attachOutputs)

	return groups
}
