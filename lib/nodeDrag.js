import { select } from "d3-selection";
import { drag } from "d3-drag";
import { getEdgeSource, getEdgeTarget, getInputOffset, getNodeAttributes, getOutputOffset, getSourcePosition, getTargetPosition, makeCurvePath, place, snap, toTranslate, } from "./utils.js";
import { moveNode } from "./actions.js";
export function makeNodeDragBehavior(context, kinds, dispatch) {
    // The binding element here is a g.node
    return drag()
        .on("start", function onStart(event) {
        this.setAttribute("cursor", "grabbing");
        context.onFocus({ element: "node", id: event.subject.id });
    })
        .on("drag", function onDrag(event) {
        const { x, y, subject } = event;
        setNodePosition.call(this, subject, [x, y]);
    })
        .on("end", function onEnd(event) {
        this.setAttribute("cursor", "grab");
        const position = snap(context, [event.x, event.y]);
        if (position.x !== event.subject.position.x ||
            position.y !== event.subject.position.y) {
            dispatch(moveNode(event.subject.id, position));
        }
        else {
            setNodePosition.call(this, event.subject, [
                event.subject.x,
                event.subject.y,
            ]);
        }
    })
        .subject(function getSubject(event) {
        const node = select(this);
        const { id, position } = getNodeAttributes(node);
        const [x, y] = place(context, position);
        const edges = select(context.edgesRef.current);
        const incoming = edges
            .selectAll(`g[data-target-id="${id}"]`)
            .datum(function () {
            const edge = select(this);
            const source = getEdgeSource(edge);
            const { kind, input } = getEdgeTarget(edge);
            return {
                sourcePosition: getSourcePosition(context, kinds, source),
                inputOffset: getInputOffset(kinds, kind, input),
            };
        });
        const outgoing = edges
            .selectAll(`g[data-source-id="${id}"]`)
            .datum(function () {
            const edge = select(this);
            const { kind, output } = getEdgeSource(edge);
            const target = getEdgeTarget(edge);
            return {
                outputOffset: getOutputOffset(kinds, kind, output),
                targetPosition: getTargetPosition(context, kinds, target),
            };
        });
        return { x, y, id, incoming, outgoing, position };
    });
}
function setEdgePosition(sourcePosition, targetPosition) {
    const d = makeCurvePath(sourcePosition, targetPosition);
    for (const path of this.querySelectorAll("path")) {
        path.setAttribute("d", d);
    }
}
function setNodePosition(subject, [x, y]) {
    this.setAttribute("transform", toTranslate([x, y]));
    subject.incoming.each(function ({ sourcePosition, inputOffset: [dx, dy] }) {
        setEdgePosition.call(this, sourcePosition, [x + dx, y + dy]);
    });
    subject.outgoing.each(function ({ outputOffset: [dx, dy], targetPosition }) {
        setEdgePosition.call(this, [x + dx, y + dy], targetPosition);
    });
}
