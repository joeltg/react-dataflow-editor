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
exports.updateOutputPorts = void 0;
const d3_drag_1 = require("d3-drag");
const preview_js_1 = require("./preview.js");
const actions = __importStar(require("./redux/actions.js"));
const styles_js_1 = require("./styles.js");
const utils_js_1 = require("./utils.js");
const outputDragBehavior = (ref) => d3_drag_1.drag()
    .on("start", function onStart(event) {
    this.classList.add("dragging");
    const { x, y, preview } = event.subject;
    preview.call(preview_js_1.startPreview, [x, y], [x, y]);
})
    .on("drag", function onDrag(event) {
    const { x, y, targets, preview } = event.subject;
    const source = [x, y];
    const result = targets.find(event.x, event.y, 2 * utils_js_1.portRadius);
    const target = result !== undefined ? [result.x, result.y] : [event.x, event.y];
    preview.call(preview_js_1.updatePreview, source, target, result !== undefined);
})
    .on("end", function onEnd(event, { source }) {
    this.classList.remove("dragging");
    const { targets, preview } = event.subject;
    preview.call(preview_js_1.stopPreview, false);
    const result = targets.find(event.x, event.y, 2 * utils_js_1.portRadius);
    if (result !== undefined) {
        const { target } = result;
        ref.dispatch(actions.createEdge(source, target));
    }
})
    .subject(function (event, { index, source: { id } }) {
    const { position: { x, y }, } = ref.nodes.get(id);
    const [width] = ref.contentDimensions.get(id);
    const offsetX = width + 2 * utils_js_1.portRadius;
    const preview = ref.svg.select("g.preview");
    return {
        targets: utils_js_1.getTargets(ref, id),
        x: x * ref.unit + offsetX,
        y: y * ref.unit + utils_js_1.getPortOffsetY(index),
        preview,
    };
});
const getOutputKey = ({ source: { output }, }) => output;
const updateOutputPorts = (ref) => (outputs) => {
    const dragBehavior = outputDragBehavior(ref);
    return outputs
        .data(({ kind, id, outputs }) => Object.keys(ref.blocks[kind].outputs).map((output, index) => ({
        index,
        source: { id, output },
        value: outputs[output],
    })), getOutputKey)
        .join((enter) => {
        const circles = enter
            .append("circle")
            .classed("port", true)
            .attr("cx", 0)
            .attr("cy", ({ index }) => utils_js_1.getPortOffsetY(index))
            .attr("r", utils_js_1.portRadius)
            .attr("fill", styles_js_1.defaultBackgroundColor)
            .attr("stroke", styles_js_1.defaultBorderColor)
            .call(dragBehavior);
        circles.append("title").text(getOutputKey).datum(null);
        return circles;
    });
};
exports.updateOutputPorts = updateOutputPorts;
