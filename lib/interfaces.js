export const Factory = {
    block: (block) => block,
    blocks: (blocks) => blocks,
};
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
export const initialEditorState = () => ({
    nodes: {},
    edges: {},
});
