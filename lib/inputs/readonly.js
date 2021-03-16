import { appendInputPorts, getInputKey, getInputs } from "./index.js";
export const updateInputPorts = (ref) => (inputs) => inputs
    .selectAll("circle.port")
    .data((node) => getInputs(ref, node), getInputKey)
    .join((enter) => appendInputPorts(enter));
