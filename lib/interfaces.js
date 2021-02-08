"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialEditorState = exports.forOutputs = exports.forInputs = exports.Factory = void 0;
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
const initialEditorState = () => ({
    id: 0,
    nodes: new Map(),
    edges: new Map(),
});
exports.initialEditorState = initialEditorState;
