import { drag } from "d3-drag";
import * as actions from "../redux/actions.js";
import { startPreview, stopPreview, updatePreview } from "../preview.js";
import { getSourcePosition, getTargetPosition, getTargets, portRadius, } from "../utils.js";
import { appendInputPorts, getInputKey, getInputs } from "./index.js";
const inputDragBehavior = (ref) => drag()
    .on("start", function onStart(event, input) {
    if (input.value !== null) {
        this.classList.add("hidden");
        event.subject.edge.classed("hidden", true);
        const sourcePosition = event.subject.sourcePosition;
        const targetPosition = [event.subject.x, event.subject.y];
        ref.preview.call(startPreview, sourcePosition, targetPosition);
    }
})
    .on("drag", function onDrag(event, input) {
    if (input.value !== null) {
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
    }
})
    .on("end", function onEnd({ x, y, subject: { targets, edge } }, { value, target: { id: fromId, input: fromInput } }) {
    if (value !== null) {
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
    }
})
    .subject(function ({}, input) {
    if (input.value == null) {
        return input;
    }
    const { source, target } = ref.graph.edges[input.value];
    const sourcePosition = getSourcePosition(ref, source);
    const [x, y] = getTargetPosition(ref, target);
    const targets = getTargets(ref, source.id);
    targets.add({
        x,
        y,
        target: {
            id: input.target.id,
            input: input.target.input,
        },
    });
    const edge = ref.edges.select(`g.edge[data-id="${input.value}"]`);
    return { targets, x, y, sourcePosition, edge };
});
export function updateInputPorts(ref) {
    const dragBehavior = inputDragBehavior(ref);
    return (inputs) => {
        inputs
            .selectAll("circle.port")
            .data((node) => getInputs(ref, node), getInputKey)
            .join((enter) => appendInputPorts(enter).call(dragBehavior), (update) => update.classed("hidden", ({ value }) => value === null));
    };
}
