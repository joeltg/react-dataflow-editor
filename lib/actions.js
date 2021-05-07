import { nanoid } from "nanoid";
export const createNode = (kind, position) => ({
    type: "node/create",
    id: nanoid(10),
    kind,
    position,
});
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
    id: nanoid(10),
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
export const focus = (subject) => ({
    type: "focus",
    subject,
});
