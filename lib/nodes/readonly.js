import { updateInputPorts } from "../inputs/readonly.js";
import { updateOutputPorts } from "../outputs/readonly.js";
import { getKey, toTranslate } from "../utils.js";
import { appendNodes } from "./index.js";
export const updateNodes = (ref) => {
    const updateInputs = updateInputPorts(ref);
    const updateOutputs = updateOutputPorts(ref);
    function focused(event, node) {
        ref.onFocus(node.id);
    }
    function blurred(event, node) {
        ref.onFocus(null);
    }
    return () => {
        ref.nodes
            .selectAll("g.node")
            .data(Object.values(ref.graph.nodes), getKey)
            .join((enter) => appendNodes(ref, enter, updateInputs, updateOutputs)
            .style("cursor", "pointer")
            .on("focus", focused)
            .on("blur", blurred), (update) => {
            update.attr("transform", ({ position: { x, y } }) => toTranslate(x * ref.unit, y * ref.unit));
            update.select("g.inputs").call(updateInputs);
            return update;
        }, (exit) => exit.remove());
    };
};
