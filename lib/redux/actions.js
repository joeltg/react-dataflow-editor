export const createNode = (kind, position) => ({ type: "node/create", kind, position });
export const moveNode = (id, position) => ({
    type: "node/move",
    id,
    position,
});
export const deleteNode = (id) => ({
    type: "node/delete",
    id,
});
export const createEdge = (source, target) => ({
    type: "edge/create",
    source,
    target,
});
export const moveEdge = (id, target) => ({
    type: "edge/move",
    id,
    target,
});
export const deleteEdge = (id) => ({
    type: "edge/delete",
    id,
});
