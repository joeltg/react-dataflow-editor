import { updateInputPorts } from "../inputs/readonly.js"

import type { Schema, Node, ReadonlyCanvasRef } from "../interfaces.js"
import { updateOutputPorts } from "../outputs/readonly.js"
import { getKey, toTranslate } from "../utils.js"

import { appendNodes } from "./index.js"

export const updateNodes = <S extends Schema>(ref: ReadonlyCanvasRef<S>) => {
	const updateInputs = updateInputPorts(ref)
	const updateOutputs = updateOutputPorts(ref)

	function focused(this: SVGGElement, event: FocusEvent, node: Node<S>) {
		if (ref.onFocus !== undefined) {
			ref.onFocus(node.id)
		}
	}

	function blurred(this: SVGGElement, event: FocusEvent, node: Node<S>) {
		if (ref.onFocus !== undefined) {
			ref.onFocus(null)
		}
	}

	const decorateNodes = ref.decorateNodes || ((node) => {})

	return () => {
		ref.nodes
			.selectAll<SVGGElement, Node<S>>("g.node")
			.data<Node<S>>(Object.values(ref.graph.nodes), getKey)
			.join(
				(enter) =>
					appendNodes(ref, enter, updateInputs, updateOutputs)
						.style("cursor", "pointer")
						.on("focus", focused)
						.on("blur", blurred),
				(update) => {
					update.attr("transform", ({ position: { x, y } }) =>
						toTranslate(x * ref.unit, y * ref.unit)
					)

					update.select<SVGGElement>("g.inputs").call(updateInputs)

					return update
				},
				(exit) => exit.remove()
			)
			.call(decorateNodes)
	}
}
