"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateInputPorts = void 0;
const d3_drag_1 = require("d3-drag");
const actions = __importStar(require("./redux/actions.js"));
const interfaces_js_1 = require("./interfaces.js");
const preview_js_1 = require("./preview.js");
const utils_js_1 = require("./utils.js");
const inputDragBehavior = (ref) => d3_drag_1.drag()
    .on("start", function onStart(event) {
    this.classList.add("hidden");
    event.subject.edge.classed("hidden", true);
    event.subject.preview.call(preview_js_1.startPreview, event.subject.sourcePosition, [
        event.subject.x,
        event.subject.y,
    ]);
})
    .on("drag", function onDrag(event) {
    const { targets, sourcePosition, preview } = event.subject;
    const result = targets.find(event.x, event.y, 2 * utils_js_1.portRadius);
    if (result !== undefined) {
        const targetPosition = [result.x, result.y];
        preview.call(preview_js_1.updatePreview, sourcePosition, targetPosition, true);
    }
    else {
        const targetPosition = [event.x, event.y];
        preview.call(preview_js_1.updatePreview, sourcePosition, targetPosition, false);
    }
})
    .on("end", function onEnd({ x, y, subject: { targets, preview, edge } }, { value, target: [fromId, fromInput] }) {
    this.classList.remove("hidden");
    edge.classed("hidden", false);
    preview.call(preview_js_1.stopPreview, false);
    const result = targets.find(x, y, 2 * utils_js_1.portRadius);
    if (result !== undefined) {
        const { target } = result;
        const [toId, toInput] = target;
        if (fromId !== toId || fromInput !== toInput) {
            ref.dispatch(actions.moveEdge(value, target));
        }
    }
    else {
        ref.dispatch(actions.deleteEdge(value));
    }
})
    .subject(function ({}, { target: [targetId, input], value }) {
    const e = ref.edges.get(value);
    const sourcePosition = utils_js_1.getSourcePosition(ref, e);
    const [x, y] = utils_js_1.getTargetPosition(ref, e);
    const [sourceId] = e.source;
    const targets = utils_js_1.getTargets(ref, sourceId);
    targets.add({ x, y, target: [targetId, input] });
    const preview = ref.svg.select("g.preview");
    const edge = ref.svg.select(`g.edges > g.edge[data-id="${value}"]`);
    return { targets, x, y, sourcePosition, preview, edge };
});
const getInputKey = ({ target: [_, input], }) => input;
const updateInputPorts = (ref) => (inputs) => {
    const dragBehavior = inputDragBehavior(ref);
    return inputs
        .data((node) => {
        const inputs = [];
        for (const [index, input] of interfaces_js_1.forInputs(ref.blocks, node.kind)) {
            const value = node.inputs[input];
            if (value !== null) {
                inputs.push({ index, target: [node.id, input], value });
            }
        }
        return inputs;
    }, getInputKey)
        .join((enter) => {
        const circles = enter
            .append("circle")
            .classed("port", true)
            .attr("cx", 0)
            .attr("cy", ({ index }) => utils_js_1.getPortOffsetY(index))
            .attr("r", utils_js_1.portRadius)
            .attr("fill", utils_js_1.defaultBackgroundColor)
            .attr("stroke", utils_js_1.defaultBorderColor)
            .call(dragBehavior);
        circles.append("title").text(getInputKey).datum(null);
        return circles;
    });
};
exports.updateInputPorts = updateInputPorts;
