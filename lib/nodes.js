"use strict";
/// <reference types="resize-observer-browser" />
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
exports.updateNodes = void 0;
const d3_drag_1 = require("d3-drag");
const d3_selection_1 = require("d3-selection");
const inputs_js_1 = require("./inputs.js");
const actions = __importStar(require("./redux/actions.js"));
const interfaces_js_1 = require("./interfaces.js");
const outputs_js_1 = require("./outputs.js");
const curve_js_1 = require("./curve.js");
const styles_js_1 = require("./styles.js");
const utils_js_1 = require("./utils.js");
const handleResize = (ref) => (entries) => {
    for (const { target, contentRect } of entries) {
        const { width, height } = contentRect;
        const foreignObject = target.parentElement;
        if (foreignObject === null) {
            continue;
        }
        foreignObject.setAttribute("width", width.toString());
        foreignObject.setAttribute("height", height.toString());
        const g = d3_selection_1.select(foreignObject.parentElement);
        const node = g.datum();
        ref.contentDimensions.set(node.id, [width, height]);
        const { inputs, outputs } = ref.blocks[node.kind];
        const { length: inputCount } = Object.keys(inputs);
        const { length: outputCount } = Object.keys(outputs);
        const w = Math.max(width, utils_js_1.minWidth) + 2 * utils_js_1.portRadius;
        const h = Math.max(height, utils_js_1.minHeight, inputCount * utils_js_1.portHeight, outputCount * utils_js_1.portHeight);
        g.select("g.frame > g.outputs").attr("transform", utils_js_1.toTranslate(w, 0));
        g.select("g.frame > path").attr("d", utils_js_1.makeClipPath(inputCount, [w, h]));
        const { x, y } = node.position;
        const x1 = x * ref.unit + width + 2 * utils_js_1.portRadius;
        for (const [index, output] of interfaces_js_1.forOutputs(ref.blocks, node.kind)) {
            const y1 = y * ref.unit + utils_js_1.getPortOffsetY(index);
            for (const id of node.outputs[output]) {
                const targetPosition = utils_js_1.getTargetPosition(ref, ref.edges.get(id));
                const d = curve_js_1.makeCurvePath([x1, y1], targetPosition);
                ref.svg.select(`g.edges > g.edge[data-id="${id}"] > path`).attr("d", d);
            }
        }
    }
};
const getBlockPosition = (ref) => ({
    foreignObjectPositionX: ({ position: { x } }) => x * ref.unit + utils_js_1.portRadius,
    foreignObjectPositionY: ({ position: { y } }) => y * ref.unit,
    frameTransform: ({ position: { x, y } }) => utils_js_1.toTranslate(x * ref.unit, y * ref.unit),
});
function setNodePosition(ref, g, { x, y }, node) {
    g.select("g.node > foreignObject")
        .attr("x", x + utils_js_1.portRadius)
        .attr("y", y);
    g.select("g.node > g.frame").attr("transform", utils_js_1.toTranslate(x, y));
    const edges = ref.svg.select("svg > g.edges");
    for (const [index, input] of interfaces_js_1.forInputs(ref.blocks, node.kind)) {
        const id = node.inputs[input];
        if (id !== null) {
            const sourcePosition = utils_js_1.getSourcePosition(ref, ref.edges.get(id));
            const d = curve_js_1.makeCurvePath(sourcePosition, [x, y + utils_js_1.getPortOffsetY(index)]);
            edges.select(`g.edge[data-id="${id}"] > path`).attr("d", d);
        }
    }
    const [offsetX] = ref.contentDimensions.get(node.id);
    const { outputs } = ref.blocks[node.kind];
    for (const [index, output] of interfaces_js_1.forOutputs(ref.blocks, node.kind)) {
        const x1 = x + offsetX + 2 * utils_js_1.portRadius;
        const y1 = y + utils_js_1.getPortOffsetY(index);
        for (const id of node.outputs[output]) {
            const targetPosition = utils_js_1.getTargetPosition(ref, ref.edges.get(id));
            const d = curve_js_1.makeCurvePath([x1, y1], targetPosition);
            edges.select(`g.edge[data-id="${id}"] > path`).attr("d", d);
        }
    }
}
const nodeDragBehavior = (ref) => d3_drag_1.drag()
    .on("start", function onStart(event, node) { })
    .on("drag", function onDrag(event, node) {
    setNodePosition(ref, d3_selection_1.select(this), event, node);
})
    .on("end", function onEnd(event, node) {
    const position = utils_js_1.snap([event.x, event.y], ref.unit, ref.dimensions);
    if (position.x === node.position.x && position.y === node.position.y) {
        setNodePosition(ref, d3_selection_1.select(this), event.subject, node);
    }
    else {
        ref.dispatch(actions.moveNode(node.id, position));
    }
})
    .subject(function (event, { position: { x, y } }) {
    return { x: ref.unit * x, y: ref.unit * y };
})
    .filter(({ target }) => target.classList.contains("header"));
const nodeClickBehavior = (ref) => function clicked(event, node) {
    if (event.defaultPrevented) {
        return;
    }
    else {
        // TODO
    }
};
const nodeKeyDownBehavior = (ref) => function keydown(event, node) {
    if (event.key === "ArrowDown") {
        event.preventDefault();
        const { x, y } = node.position;
        const [_, Y] = ref.dimensions;
        if (y < Y - 1) {
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
        const [X] = ref.dimensions;
        if (x < X - 1) {
            ref.dispatch(actions.moveNode(node.id, { x: x + 1, y }));
        }
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
const updateNodes = (ref) => {
    const { foreignObjectPositionX, foreignObjectPositionY, frameTransform, } = getBlockPosition(ref);
    const observer = new ResizeObserver(handleResize(ref));
    const nodeDrag = nodeDragBehavior(ref);
    const nodeClick = nodeClickBehavior(ref);
    const nodeKeyDown = nodeKeyDownBehavior(ref);
    const updateInputs = inputs_js_1.updateInputPorts(ref);
    const updateOutputs = outputs_js_1.updateOutputPorts(ref);
    return () => {
        const nodes = ref.svg
            .select("g.nodes")
            .selectAll("g.node")
            .data(ref.nodes.values(), function (node, index, groups) {
            return node.id.toString();
        })
            .join((enter) => {
            const groups = enter
                .append("g")
                .classed("node", true)
                .attr("data-id", utils_js_1.getKey)
                .attr("tabindex", 0)
                .call(nodeDrag)
                .on("click", nodeClick)
                .on("keydown", nodeKeyDown)
                .each(({ id }) => ref.contentDimensions.set(id, [utils_js_1.minWidth, utils_js_1.minHeight]));
            const frames = groups
                .append("g")
                .classed("frame", true)
                .attr("transform", frameTransform);
            const paths = frames
                .append("path")
                .attr("stroke", styles_js_1.defaultBorderColor)
                .attr("fill", styles_js_1.getBackgroundColor(ref.blocks))
                .attr("stroke-width", 1);
            const inputs = frames.append("g").classed("inputs", true);
            const inputPorts = inputs
                .selectAll("circle.port")
                .call(updateInputs);
            const outputs = frames.append("g").classed("outputs", true);
            const outputPorts = outputs
                .selectAll("circle.port")
                .call(updateOutputs);
            const foreignObjects = groups
                .append("foreignObject")
                .attr("x", foreignObjectPositionX)
                .attr("y", foreignObjectPositionY);
            const contents = foreignObjects
                .append("xhtml:div")
                .classed("content", true)
                .style("position", "fixed")
                .style("width", "max-content")
                .attr("xmlns", "http://www.w3.org/1999/xhtml")
                .each(function () {
                observer.observe(this);
            });
            return groups;
        }, (update) => {
            const frames = update
                .select("g.frame")
                .attr("transform", frameTransform);
            frames
                .select("g.inputs")
                .selectAll("circle.port")
                .call(updateInputs);
            frames
                .select("g.outputs")
                .selectAll("circle.port")
                .call(updateOutputs);
            update
                .select("foreignObject")
                .attr("x", foreignObjectPositionX)
                .attr("y", foreignObjectPositionY);
            return update;
        }, (exit) => {
            exit
                .each(function ({ id }) {
                ref.contentDimensions.delete(id);
                const content = this.querySelector("foreignObject > div.content");
                if (content !== null) {
                    observer.unobserve(content);
                }
            })
                .remove();
        });
        return nodes.select("foreignObject > div.content");
    };
};
exports.updateNodes = updateNodes;
