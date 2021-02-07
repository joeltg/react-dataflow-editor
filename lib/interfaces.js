"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialSystemState = exports.forOutputs = exports.forInputs = exports.Factory = void 0;
exports.Factory = {
    block: (block) => block,
    blocks: (blocks) => blocks,
};
function* forInputs(blocks, kind) {
    for (const entry of Object.keys(blocks[kind].inputs).entries()) {
        yield entry;
    }
}
exports.forInputs = forInputs;
function* forOutputs(blocks, kind) {
    for (const entry of Object.keys(blocks[kind].outputs).entries()) {
        yield entry;
    }
}
exports.forOutputs = forOutputs;
const initialSystemState = () => ({
    id: 0,
    nodes: new Map(),
    edges: new Map(),
});
exports.initialSystemState = initialSystemState;
