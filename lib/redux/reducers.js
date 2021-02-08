"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootReducer = void 0;
const interfaces_js_1 = require("../interfaces.js");
const rootReducer = (blocks, initialState = interfaces_js_1.initialEditorState()) => (state = initialState, action) => {
    if (action.type === "node/update") {
        const { id, value } = action;
        const nodes = new Map(state.nodes);
        const node = nodes.get(id);
        nodes.set(id, { ...node, value });
        return { ...state, nodes };
    }
    else if (action.type === "node/create") {
        const { kind, position } = action;
        const nodes = new Map(state.nodes);
        nodes.set(state.id, createInitialNode(blocks, kind, position, state.id));
        return { ...state, id: state.id + 1, nodes };
    }
    else if (action.type === "node/move") {
        const { id, position } = action;
        const nodes = new Map(state.nodes);
        nodes.set(id, { ...nodes.get(id), position });
        return { ...state, nodes };
    }
    else if (action.type === "node/delete") {
        const { id } = action;
        const { kind, inputs, outputs } = state.nodes.get(id);
        const nodes = new Map(state.nodes);
        const edges = new Map(state.edges);
        for (const [_, input] of interfaces_js_1.forInputs(blocks, kind)) {
            const edgeId = inputs[input];
            if (edgeId !== null) {
                const { source: { id: sourceId, output }, } = edges.get(edgeId);
                edges.delete(edgeId);
                const source = nodes.get(sourceId);
                const outputs = new Set(source.outputs[output]);
                outputs.delete(edgeId);
                nodes.set(sourceId, {
                    ...source,
                    outputs: { ...source.outputs, [output]: outputs },
                });
            }
        }
        for (const [_, output] of interfaces_js_1.forOutputs(blocks, kind)) {
            for (const edgeId of outputs[output]) {
                const { target: { id: targetId, input }, } = edges.get(edgeId);
                edges.delete(edgeId);
                const target = nodes.get(targetId);
                nodes.set(targetId, {
                    ...target,
                    inputs: { ...target.inputs, [input]: null },
                });
            }
        }
        nodes.delete(id);
        return { ...state, nodes, edges };
    }
    else if (action.type === "edge/create") {
        const { source, target } = action;
        const edges = new Map(state.edges);
        edges.set(state.id, { id: state.id, source, target });
        const nodes = new Map(state.nodes);
        const { id: sourceId, output } = source;
        const sourceNode = nodes.get(sourceId);
        const sourceOutput = new Set(sourceNode.outputs[output]);
        sourceOutput.add(state.id);
        nodes.set(sourceId, {
            ...sourceNode,
            outputs: { ...sourceNode.outputs, [output]: sourceOutput },
        });
        const { id: targetId, input } = target;
        const targetNode = nodes.get(targetId);
        nodes.set(targetId, {
            ...targetNode,
            inputs: { ...targetNode.inputs, [input]: state.id },
        });
        return { ...state, id: state.id + 1, edges, nodes };
    }
    else if (action.type === "edge/move") {
        const { id, target } = action;
        const edges = new Map(state.edges);
        const edge = edges.get(id);
        const { id: fromNodeId, input: fromInput } = edge.target;
        const nodes = new Map(state.nodes);
        const fromNode = nodes.get(fromNodeId);
        nodes.set(fromNodeId, {
            ...fromNode,
            inputs: { ...fromNode.inputs, [fromInput]: null },
        });
        const { id: toId, input: toInput } = target;
        const toNode = nodes.get(toId);
        nodes.set(toId, { ...toNode, inputs: { ...toNode.inputs, [toInput]: id } });
        edges.set(id, { ...edge, target });
        return { ...state, edges, nodes };
    }
    else if (action.type === "edge/delete") {
        const { id } = action;
        const edges = new Map(state.edges);
        const edge = edges.get(id);
        const nodes = new Map(state.nodes);
        const { id: sourceId, output } = edge.source;
        const sourceNode = nodes.get(sourceId);
        const sourceOutput = new Set(sourceNode.outputs[output]);
        sourceOutput.delete(id);
        nodes.set(sourceId, {
            ...sourceNode,
            outputs: { ...sourceNode.outputs, [output]: sourceOutput },
        });
        const { id: targetId, input } = edge.target;
        const targetNode = nodes.get(targetId);
        nodes.set(targetId, {
            ...targetNode,
            inputs: { ...targetNode.inputs, [input]: null },
        });
        edges.delete(id);
        return { ...state, edges, nodes };
    }
    else {
        return state;
    }
};
exports.rootReducer = rootReducer;
function createInitialNode(blocks, kind, position, id) {
    const inputs = Object.fromEntries(Object.keys(blocks[kind].inputs).map((input) => [input, null]));
    const outputs = Object.fromEntries(Object.keys(blocks[kind].outputs).map((output) => [output, new Set()]));
    const value = blocks[kind].initialValue;
    return { id, kind, position, inputs, outputs, value };
}
