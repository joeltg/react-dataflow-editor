"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditorContext = exports.defaultCanvasUnit = exports.snap = exports.getTargets = exports.getY = exports.getX = exports.getPortOffsetY = exports.getTargetPosition = exports.getSourcePosition = exports.toTranslate = exports.getKey = exports.minHeight = exports.minWidth = exports.makeClipPath = exports.portHeight = exports.portMargin = exports.portRadius = void 0;
const d3_quadtree_1 = require("d3-quadtree");
const react_1 = require("react");
const interfaces_1 = require("./interfaces");
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
exports.minWidth = exports.portHeight;
exports.minHeight = exports.portHeight;
const getKey = ({ id }) => id.toString();
exports.getKey = getKey;
const toTranslate = (x, y) => `translate(${x}, ${y})`;
exports.toTranslate = toTranslate;
function getSourcePosition(ref, { source: { id, output } }) {
    const { kind, position: { x, y }, } = ref.nodes.get(id);
    const index = Object.keys(ref.blocks[kind].outputs).indexOf(output);
    const offsetY = exports.getPortOffsetY(index);
    const [offsetX] = ref.contentDimensions.get(id);
    return [x * ref.unit + offsetX + 2 * exports.portRadius, y * ref.unit + offsetY];
}
exports.getSourcePosition = getSourcePosition;
function getTargetPosition(ref, { target: { id, input } }) {
    const { kind, position: { x, y }, } = ref.nodes.get(id);
    const index = Object.keys(ref.blocks[kind].inputs).indexOf(input);
    const offsetY = exports.getPortOffsetY(index);
    return [x * ref.unit, y * ref.unit + offsetY];
}
exports.getTargetPosition = getTargetPosition;
const getPortOffsetY = (index) => index * exports.portHeight + exports.portMargin + exports.portRadius;
exports.getPortOffsetY = getPortOffsetY;
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
            const { x, y } = node.position;
            for (const [index, input] of interfaces_1.forInputs(ref.blocks, node.kind)) {
                if (node.inputs[input] === null) {
                    targets.push({
                        target: { id: node.id, input },
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
const snap = ([x, y], unit, [X, Y]) => ({
    x: Math.min(X - 1, Math.max(0, Math.round(x / unit))),
    y: Math.min(Y - 1, Math.max(0, Math.round(y / unit))),
});
exports.snap = snap;
exports.defaultCanvasUnit = 72;
exports.EditorContext = react_1.createContext({
    unit: exports.defaultCanvasUnit,
    dimensions: [12, 8],
});
