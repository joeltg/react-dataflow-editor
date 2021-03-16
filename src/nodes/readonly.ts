import { updateInputPorts } from "../inputs/readonly.js"

import { Schema, Node, ReadonlyCanvasRef } from "../interfaces.js"
import { updateOutputPorts } from "../outputs/readonly.js"
import { getKey, toTranslate } from "../utils.js"

import { appendNodes } from "./index.js"

export const updateNodes = <S extends Schema>(ref: ReadonlyCanvasRef<S>) => {
	const updateInputs = updateInputPorts(ref)
	const updateOutputs = updateOutputPorts(ref)

	function focused(this: SVGGElement, event: FocusEvent, node: Node<S>) {
		ref.onFocus(node.id)
	}

	function blurred(this: SVGGElement, event: FocusEvent, node: Node<S>) {
		ref.onFocus(null)
	}

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
	}
}
