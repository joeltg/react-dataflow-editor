import { quadtree } from "d3-quadtree";
import { forInputs, } from "./interfaces.js";
export const blockWidth = 144;
export const portRadius = 12;
export const portMargin = 12;
export const portHeight = portRadius * 2 + portMargin * 2;
const inputPortArc = `a ${portRadius} ${portRadius} 0 0 1 0 ${2 * portRadius}`;
const inputPort = `v ${portMargin} ${inputPortArc} v ${portMargin}`;
export function makeClipPath(inputCount, [width, height]) {
    const path = ["M 0 0 V 0"];
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
export const getPortOffsetY = (index) => index * portHeight + portMargin + portRadius;
export const getX = ({ x }) => x;
export const getY = ({ y }) => y;
export function getTargets(ref, sourceId) {
    const targets = [];
    for (const node of Object.values(ref.graph.nodes)) {
        if (node.id === sourceId) {
            continue;
        }
        else {
            const { x, y } = node.position;
            for (const [index, input] of forInputs(ref.blocks, node.kind)) {
                if (node.inputs[input] === null) {
                    targets.push({
                        target: { id: node.id, input },
                        x: x * ref.unit,
                        y: y * ref.unit + getPortOffsetY(index),
                    });
                }
            }
        }
    }
    return quadtree(targets, getX, getY);
}
export const snap = ([x, y], unit, [X, Y]) => ({
    x: Math.min(X - 1, Math.max(0, Math.round(x / unit))),
    y: Math.min(Y - 1, Math.max(0, Math.round(y / unit))),
});
export const defaultCanvasUnit = 52;
export const defaultCanvasDimensions = [12, 12];
