import { drag } from "d3-drag";
import { updateInputPorts } from "../inputs/editable.js";
import * as actions from "../state/actions.js";
import { updateOutputPorts } from "../outputs/editable.js";
import { getKey, getPortOffsetY, getSourcePosition, getTargetPosition, toTranslate, snap, nodeWidth, getTargetIndex, getSourceIndex, } from "../utils.js";
import { appendNodes } from "./index.js";
import { setEdgePosition } from "../edges.js";
const nodeDragBehavior = (ref) => {
    function setNodePosition(subject, { x, y }) {
        this.setAttribute("transform", toTranslate(x, y));
        const x2 = x;
        subject.incoming.each(function ({ source, target }) {
            const sourcePosition = getSourcePosition(ref, source);
            const targetIndex = getTargetIndex(ref, target);
            const y2 = y + getPortOffsetY(targetIndex);
            setEdgePosition.call(this, sourcePosition, [x2, y2]);
        });
        const x1 = x + nodeWidth;
        subject.outgoing.each(function ({ source, target }) {
            const sourceIndex = getSourceIndex(ref, source);
            const y1 = y + getPortOffsetY(sourceIndex);
            const targetPosition = getTargetPosition(ref, target);
            setEdgePosition.call(this, [x1, y1], targetPosition);
        });
    }
    return drag()
        .on("start", function onStart(event, node) {
        this.style.cursor = "grabbing";
    })
        .on("drag", function onDrag(event, node) {
        const { x, y, subject } = event;
        setNodePosition.call(this, subject, { x, y });
    })
        .on("end", function onEnd(event, node) {
        this.style.cursor = "grab";
        const snapped = snap(ref, [event.x, event.y]);
        if (snapped.x === node.position.x && snapped.y === node.position.y) {
            const position = { x: snapped.x * ref.unit, y: snapped.y * ref.unit };
            setNodePosition.call(this, event.subject, position);
        }
        else {
            ref.dispatch(actions.moveNode(node.id, snapped));
        }
    })
        .subject(function (event, node) {
        const { x, y } = node.position;
        const incoming = ref.edges.selectAll(`g.edge[data-target="${node.id}"]`);
        const outgoing = ref.edges.selectAll(`g.edge[data-source="${node.id}"]`);
        return { x: ref.unit * x, y: ref.unit * y, incoming, outgoing };
    });
};
const nodeKeyDownBehavior = (ref) => function keydown(event, node) {
    if (event.key === "ArrowDown") {
        event.preventDefault();
        const { x, y } = node.position;
        if (y < ref.height - 1) {
            ref.dispatch(actions.moveNode(node.id, { x, y: y + 1 }));
        }
    }
    else if (event.key === "ArrowUp") {
        event.preventDefault();
        const { x, y } = node.position;
        if (y > 0) {
            ref.dispatch(actions.moveNode(node.id, { x, y: y - 1 }));
        }
    }
    else if (event.key === "ArrowRight") {
        event.preventDefault();
        const { x, y } = node.position;
        ref.dispatch(actions.moveNode(node.id, { x: x + 1, y }));
    }
    else if (event.key === "ArrowLeft") {
        event.preventDefault();
        const { x, y } = node.position;
        if (x > 0) {
            ref.dispatch(actions.moveNode(node.id, { x: x - 1, y }));
        }
    }
    else if (event.key === "Backspace") {
        event.preventDefault();
        ref.dispatch(actions.deleteNode(node.id));
    }
};
export const updateNodes = (ref) => {
    const nodeDrag = nodeDragBehavior(ref);
    const nodeKeyDown = nodeKeyDownBehavior(ref);
    const updateInputs = updateInputPorts(ref);
    const updateOutputs = updateOutputPorts(ref);
    function focused(event, node) {
        if (ref.onFocus !== undefined) {
            ref.onFocus(node.id);
        }
    }
    function blurred(event, node) {
        if (ref.onFocus !== undefined) {
            ref.onFocus(null);
        }
    }
    const decorateNodes = ref.decorateNodes || ((node) => { });
    return () => {
        ref.nodes
            .selectAll("g.node")
            .data(Object.values(ref.graph.nodes), getKey)
            .join((enter) => appendNodes(ref, enter, updateInputs, updateOutputs)
            .style("cursor", "grab")
            .on("focus", focused)
            .on("blur", blurred)
            .on("keydown", nodeKeyDown)
            .call(nodeDrag), (update) => {
            update.attr("transform", ({ position: { x, y } }) => toTranslate(x * ref.unit, y * ref.unit));
            update.select("g.inputs").call(updateInputs);
            return update;
        }, (exit) => exit.remove())
            .call(decorateNodes);
    };
};
