import { drag } from "d3-drag";
import { startPreview, stopPreview, updatePreview } from "../preview.js";
import * as actions from "../redux/actions.js";
import { getPortOffsetY, getTargets, portRadius, blockWidth, } from "../utils.js";
import { appendOutputPorts, getOutputKey, getOutputs } from "./index.js";
const outputDragBehavior = (ref) => drag()
    .on("start", function onStart(event) {
    this.classList.add("dragging");
    const { x, y } = event.subject;
    ref.preview.call(startPreview, [x, y], [x, y]);
})
    .on("drag", function onDrag(event) {
    const { x, y, targets } = event.subject;
    const source = [x, y];
    const result = targets.find(event.x, event.y, 2 * portRadius);
    const target = result !== undefined ? [result.x, result.y] : [event.x, event.y];
    ref.preview.call(updatePreview, source, target, result !== undefined);
})
    .on("end", function onEnd(event, { source }) {
    this.classList.remove("dragging");
    const { targets } = event.subject;
    ref.preview.call(stopPreview, false);
    const result = targets.find(event.x, event.y, 2 * portRadius);
    if (result !== undefined) {
        const { target } = result;
        ref.dispatch(actions.createEdge(source, target));
    }
})
    .subject(function (event, { index, source: { id } }) {
    const { position: { x, y }, } = ref.graph.nodes[id];
    return {
        targets: getTargets(ref, id),
        x: x * ref.unit + blockWidth,
        y: y * ref.unit + getPortOffsetY(index),
    };
});
export function updateOutputPorts(ref) {
    const dragBehavior = outputDragBehavior(ref);
    return (outputs) => outputs
        .selectAll("circle.port")
        .data((node) => getOutputs(ref, node), getOutputKey)
        .join((enter) => appendOutputPorts(enter).call(dragBehavior));
}
