import { ReadonlyCanvasRef, Schema } from "../interfaces.js"
import { AttachPorts } from "../utils.js"

import { Input, appendInputPorts, getInputKey, getInputs } from "./index.js"

export const updateInputPorts = <S extends Schema>(
	ref: ReadonlyCanvasRef<S>
): AttachPorts<S> => (inputs) =>
	inputs
		.selectAll<SVGCircleElement, Input<S>>("circle.port")
		.data((node) => getInputs(ref, node), getInputKey)
		.join(
			(enter) => appendInputPorts(enter),
			(update) =>
				update
					.classed("hidden", ({ value }) => value === null)
					.attr("data-value", ({ value }) => value)
		)
