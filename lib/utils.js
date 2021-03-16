import { defaultBackgroundColor, defaultBorderColor } from "./styles.js";
export const blockWidth = 156;
export const blockHeaderHeight = 24;
export const portRadius = 12;
export const portMargin = 12;
export const portHeight = portRadius * 2 + portMargin * 2;
export const SVG_STYLE = `
g.node circle.port { cursor: grab }
g.node circle.port.hidden { display: none }
g.node > g.outputs > circle.port.dragging { cursor: grabbing }

g.node:focus { stroke-width: 3 }

g.edge.hidden { display: none }

g.preview.hidden { display: none }
g.preview > path.curve {
	stroke: gray;
	stroke-width: 6px;
	fill: none;
	stroke-dasharray: 8 6;
}
g.preview > circle {
	fill: ${defaultBackgroundColor};
	stroke: ${defaultBorderColor};
	stroke-width: 4px;
}
`;
const inputPortArc = `a ${portRadius} ${portRadius} 0 0 1 0 ${2 * portRadius}`;
const inputPort = `v ${portMargin} ${inputPortArc} v ${portMargin}`;
export function makeClipPath(inputCount, [width, height]) {
    const path = [`M 0 0 V ${blockHeaderHeight}`];
    for (let i = 0; i < inputCount; i++) {
        path.push(inputPort);
    }
    path.push(`V ${height} H ${width} V 0 Z`);
    return path.join(" ");
}
export const getKey = ({ id }) => id;
export const toTranslate = (x, y) => `translate(${x}, ${y})`;
export const getSourceIndex = (ref, source) => {
    const { kind } = ref.graph.nodes[source.id];
    const keys = Object.keys(ref.blocks[kind].outputs);
    return keys.indexOf(source.output);
};
export const getTargetIndex = (ref, target) => {
    const { kind } = ref.graph.nodes[target.id];
    const keys = Object.keys(ref.blocks[kind].inputs);
    return keys.indexOf(target.input);
};
export function getSourcePosition(ref, source) {
    const { position: { x, y }, } = ref.graph.nodes[source.id];
    const index = getSourceIndex(ref, source);
    const offsetY = getPortOffsetY(index);
    return [x * ref.unit + blockWidth, y * ref.unit + offsetY];
}
export function getTargetPosition(ref, target) {
    const { position: { x, y }, } = ref.graph.nodes[target.id];
    const index = getTargetIndex(ref, target);
    const offsetY = getPortOffsetY(index);
    return [x * ref.unit, y * ref.unit + offsetY];
}
export const getPortOffsetY = (index) => blockHeaderHeight + index * portHeight + portMargin + portRadius;
export function* forInputs(blocks, kind) {
    for (const entry of Object.keys(blocks[kind].inputs).entries()) {
        yield entry;
    }
}
export function* forOutputs(blocks, kind) {
    for (const entry of Object.keys(blocks[kind].outputs).entries()) {
        yield entry;
    }
}
export const snap = (ref, [x, y]) => ({
    x: Math.max(0, Math.round(x / ref.unit)),
    y: Math.min(ref.height - 1, Math.max(0, Math.round(y / ref.unit))),
});
export const defaultCanvasUnit = 52;
export const defaultCanvasHeight = 12;
