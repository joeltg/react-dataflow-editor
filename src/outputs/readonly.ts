import type { ReadonlyCanvasRef, Schema } from "../interfaces.js"
import { AttachPorts } from "../utils.js"

import { appendOutputPorts, getOutputKey, getOutputs, Output } from "./index.js"

export const updateOutputPorts = <S extends Schema>(
	ref: ReadonlyCanvasRef<S>
): AttachPorts<S> => (outputs) =>
	outputs
		.selectAll<SVGCircleElement, Output<S>>("circle.port")
		.data((node) => getOutputs(ref, node), getOutputKey)
		.join((enter) => appendOutputPorts(enter))
