import { select } from "d3-selection";
export function signalInvalidType(type) {
    console.error(type);
    throw new Error("Unexpected type");
}
export const initialEditorState = () => ({
    nodes: {},
    edges: {},
    focus: null,
});
export const nodeWidth = 156;
export const nodeMarginX = 4;
export const nodeHeaderHeight = 24;
export const portRadius = 12;
export const portMargin = 12;
export const portHeight = portRadius * 2 + portMargin * 2;
const inputPortArc = `a ${portRadius} ${portRadius} 0 0 1 0 ${2 * portRadius}`;
const inputPort = `v ${portMargin} ${inputPortArc} v ${portMargin}`;
export function makeClipPath(kinds, kind) {
    const { inputs, outputs } = kinds[kind];
    const { length: inputCount } = Object.keys(inputs);
    const { length: outputCount } = Object.keys(outputs);
    const nodeHeight = nodeHeaderHeight + portHeight * Math.max(inputCount, outputCount);
    const path = [`M 0 0 V ${nodeHeaderHeight}`];
    for (let i = 0; i < inputCount; i++) {
        path.push(inputPort);
    }
    path.push(`V ${nodeHeight} H ${nodeWidth} V 0 Z`);
    return path.join(" ");
}
export function place(context, { x, y }, offset) {
    if (offset === undefined) {
        return [x * context.unit, y * context.unit];
    }
    else {
        const [dx, dy] = offset;
        return [x * context.unit + dx, y * context.unit + dy];
    }
}
export const toTranslate = ([x, y]) => `translate(${x}, ${y})`;
export function getPortOffsetY(index) {
    if (index === -1) {
        throw new Error("Invalid port offset index");
    }
    return nodeHeaderHeight + index * portHeight + portMargin + portRadius;
}
const keyIndexCache = new WeakMap();
function getKeyIndex(ports, name) {
    const indices = keyIndexCache.get(ports);
    if (indices !== undefined) {
        return indices[name];
    }
    else {
        const keys = Object.keys(ports);
        const indices = Object.fromEntries(keys.map((key, index) => [key, index]));
        keyIndexCache.set(ports, indices);
        return indices[name];
    }
}
export const getInputIndex = (kinds, kind, input) => getKeyIndex(kinds[kind].inputs, input);
export const getOutputIndex = (kinds, kind, output) => getKeyIndex(kinds[kind].outputs, output);
export function getInputOffset(kinds, kind, input) {
    const index = Object.keys(kinds[kind].inputs).indexOf(input);
    return [0, getPortOffsetY(index)];
}
export function getOutputOffset(kinds, kind, output) {
    const index = Object.keys(kinds[kind].outputs).indexOf(output);
    return [nodeWidth, getPortOffsetY(index)];
}
export function getSourcePosition(context, kinds, { id, output }) {
    const nodes = select(context.nodesRef.current);
    const node = nodes.select(`g.node[data-id="${id}"]`);
    const { kind, position } = getNodeAttributes(node);
    const offset = getOutputOffset(kinds, kind, output);
    return place(context, position, offset);
}
export function getTargetPosition(context, kinds, { id, input }) {
    const nodes = select(context.nodesRef.current);
    const node = nodes.select(`g.node[data-id="${id}"]`);
    const { kind, position } = getNodeAttributes(node);
    const offset = getInputOffset(kinds, kind, input);
    return place(context, position, offset);
}
export function* forInputs(kinds, kind) {
    for (const input of Object.keys(kinds[kind].inputs)) {
        yield input;
    }
}
export function* forOutputs(kinds, kind) {
    for (const output of Object.keys(kinds[kind].outputs)) {
        yield output;
    }
}
export const snap = ({ unit, height }, [x, y]) => ({
    x: Math.max(0, Math.round(x / unit)),
    y: Math.min(height - 1, Math.max(0, Math.round(y / unit))),
});
const minCurveExtent = 104;
export function makeCurvePath([x1, y1], [x2, y2]) {
    const dx = x2 - x1;
    const mx = x1 + dx / 2;
    const dy = y2 - y1;
    const my = y1 + dy / 2;
    const qx = x1 + Math.max(Math.min(minCurveExtent, Math.abs(dy / 2)), dx / 4);
    return `M ${x1} ${y1} Q ${qx} ${y1} ${mx} ${my} T ${x2} ${y2}`;
}
export function getNodeAttributes(node) {
    const id = node.attr("data-id");
    const kind = node.attr("data-kind");
    const x = parseInt(node.attr("data-position-x"));
    const y = parseInt(node.attr("data-position-y"));
    return { id, kind, position: { x, y } };
}
export function getEdgeSource(edge) {
    return {
        id: edge.attr("data-source-id"),
        output: edge.attr("data-source-output"),
        kind: edge.attr("data-source-kind"),
    };
}
export function getEdgeTarget(edge) {
    return {
        id: edge.attr("data-target-id"),
        input: edge.attr("data-target-input"),
        kind: edge.attr("data-target-kind"),
    };
}
export function isFocusEqual(a, b) {
    if (a === null && b === null) {
        return true;
    }
    else if (a === null || b === null) {
        return false;
    }
    else {
        return a.element === b.element && a.id === b.id;
    }
}
