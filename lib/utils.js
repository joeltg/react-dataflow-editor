"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.snap = exports.getTargets = exports.getY = exports.getX = exports.getBackgroundColor = exports.getPortOffsetY = exports.getTargetPosition = exports.getSourcePosition = exports.positionEqual = exports.toTranslate = exports.getKey = exports.minHeight = exports.minWidth = exports.defaultBorderColor = exports.defaultBackgroundColor = exports.defaultCanvasUnit = exports.makeClipPath = exports.portHeight = exports.portMargin = exports.portRadius = void 0;
const d3_quadtree_1 = require("d3-quadtree");
exports.portRadius = 12;
exports.portMargin = 12;
exports.portHeight = exports.portRadius * 2 + exports.portMargin * 2;
const inputPortArc = `a ${exports.portRadius} ${exports.portRadius} 0 0 1 0 ${2 * exports.portRadius}`;
const inputPort = `v ${exports.portMargin} ${inputPortArc} v ${exports.portMargin}`;
function makeClipPath(inputCount, [width, height]) {
    const path = ["M 0 0 V 0"];
    for (let i = 0; i < inputCount; i++) {
        path.push(inputPort);
    }
    path.push(`V ${height} H ${width} V 0 Z`);
    return path.join(" ");
}
exports.makeClipPath = makeClipPath;
exports.defaultCanvasUnit = 72;
exports.defaultBackgroundColor = "lightgray";
exports.defaultBorderColor = "dimgray";
exports.minWidth = exports.portHeight;
exports.minHeight = exports.portHeight;
const getKey = ({ id }) => id.toString();
exports.getKey = getKey;
const toTranslate = (x, y) => `translate(${x}, ${y})`;
exports.toTranslate = toTranslate;
const positionEqual = ([x1, y1], [x2, y2]) => x1 === x2 && y1 === y2;
exports.positionEqual = positionEqual;
function getSourcePosition(ref, { source: [id, output] }) {
    const { kind, position: [x, y], } = ref.nodes.get(id);
    const index = ref.schema[kind].outputs.indexOf(output);
    const offsetY = exports.getPortOffsetY(index);
    const [offsetX] = ref.contentDimensions.get(id);
    return [x * ref.unit + offsetX + 2 * exports.portRadius, y * ref.unit + offsetY];
}
exports.getSourcePosition = getSourcePosition;
function getTargetPosition(ref, { target: [id, input] }) {
    const { kind, position: [x, y], } = ref.nodes.get(id);
    const index = ref.schema[kind].inputs.indexOf(input);
    const offsetY = exports.getPortOffsetY(index);
    return [x * ref.unit, y * ref.unit + offsetY];
}
exports.getTargetPosition = getTargetPosition;
const getPortOffsetY = (index) => index * exports.portHeight + exports.portMargin + exports.portRadius;
exports.getPortOffsetY = getPortOffsetY;
const getBackgroundColor = (schema) => ({ kind, }) => schema[kind].backgroundColor || exports.defaultBackgroundColor;
exports.getBackgroundColor = getBackgroundColor;
const getX = ({ x }) => x;
exports.getX = getX;
const getY = ({ y }) => y;
exports.getY = getY;
function getTargets(ref, sourceId) {
    const targets = [];
    for (const node of ref.nodes.values()) {
        if (node.id === sourceId) {
            continue;
        }
        else {
            const [x, y] = node.position;
            const { inputs } = ref.schema[node.kind];
            for (const [index, input] of inputs.entries()) {
                if (node.inputs[input] === null) {
                    targets.push({
                        target: [node.id, input],
                        x: x * ref.unit,
                        y: y * ref.unit + exports.getPortOffsetY(index),
                    });
                }
            }
        }
    }
    return d3_quadtree_1.quadtree(targets, exports.getX, exports.getY);
}
exports.getTargets = getTargets;
const snap = ([x, y], unit, [X, Y]) => [
    Math.min(X - 1, Math.max(0, Math.round(x / unit))),
    Math.min(Y - 1, Math.max(0, Math.round(y / unit))),
];
exports.snap = snap;
//# sourceMappingURL=utils.js.map