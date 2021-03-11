import { drag } from "d3-drag";
import * as actions from "./redux/actions.js";
import { forInputs } from "./interfaces.js";
import { startPreview, stopPreview, updatePreview } from "./preview.js";
import { getPortOffsetY, getSourcePosition, getTargetPosition, getTargets, portRadius, } from "./utils.js";
import { defaultBackgroundColor, defaultBorderColor } from "./styles.js";
const inputDragBehavior = (ref) => drag()
    .on("start", function onStart(event) {
    this.classList.add("hidden");
    event.subject.edge.classed("hidden", true);
    const sourcePosition = event.subject.sourcePosition;
    const targetPosition = [event.subject.x, event.subject.y];
    ref.preview.call(startPreview, sourcePosition, targetPosition);
})
    .on("drag", function onDrag(event) {
    const { targets, sourcePosition } = event.subject;
    const result = targets.find(event.x, event.y, 2 * portRadius);
    if (result !== undefined) {
        const targetPosition = [result.x, result.y];
        ref.preview.call(updatePreview, sourcePosition, targetPosition, true);
    }
    else {
        const targetPosition = [event.x, event.y];
        ref.preview.call(updatePreview, sourcePosition, targetPosition, false);
    }
})
    .on("end", function onEnd({ x, y, subject: { targets, edge } }, { value, target: { id: fromId, input: fromInput } }) {
    this.classList.remove("hidden");
    edge.classed("hidden", false);
    ref.preview.call(stopPreview, false);
    const result = targets.find(x, y, 2 * portRadius);
    if (result !== undefined) {
        const { target } = result;
        const { id: toId, input: toInput } = target;
        if (fromId !== toId || fromInput !== toInput) {
            ref.dispatch(actions.moveEdge(value, target));
        }
    }
    else {
        ref.dispatch(actions.deleteEdge(value));
    }
})
    .subject(function ({}, { target: { id: targetId, input }, value }) {
    const { source, target } = ref.graph.edges[value];
    const sourcePosition = getSourcePosition(ref, source);
    const [x, y] = getTargetPosition(ref, target);
    const targets = getTargets(ref, source.id);
    targets.add({ x, y, target: { id: targetId, input } });
    const edge = ref.edges.select(`g.edge[data-id="${value}"]`);
    return { targets, x, y, sourcePosition, edge };
});
const getInputKey = ({ target: { input }, }) => input;
export const updateInputPorts = (ref) => (inputs) => {
    const dragBehavior = inputDragBehavior(ref);
    return inputs
        .data((node) => {
        const inputs = [];
        for (const [index, input] of forInputs(ref.blocks, node.kind)) {
            const value = node.inputs[input];
            if (value !== null) {
                inputs.push({ index, target: { id: node.id, input }, value });
            }
        }
        return inputs;
    }, getInputKey)
        .join((enter) => {
        const circles = enter
            .append("circle")
            .classed("port", true)
            .attr("cx", 0)
            .attr("cy", ({ index }) => getPortOffsetY(index))
            .attr("r", portRadius)
            .attr("fill", defaultBackgroundColor)
            .attr("stroke", defaultBorderColor)
            .call(dragBehavior);
        circles.append("title").text(getInputKey).datum(null);
        return circles;
    });
};
