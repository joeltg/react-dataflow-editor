import { appendOutputPorts, getOutputKey, getOutputs } from "./index.js";
export const updateOutputPorts = (ref) => (outputs) => outputs
    .selectAll("circle.port")
    .data((node) => getOutputs(ref, node), getOutputKey)
    .join((enter) => enter.call(appendOutputPorts));
