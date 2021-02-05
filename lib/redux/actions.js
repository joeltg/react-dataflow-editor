"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEdge = exports.moveEdge = exports.createEdge = exports.deleteNode = exports.moveNode = exports.createNode = exports.updateNode = void 0;
const updateNode = (id, value) => ({
    type: "node/update",
    id,
    value,
});
exports.updateNode = updateNode;
const createNode = (kind, position) => ({ type: "node/create", kind, position });
exports.createNode = createNode;
const moveNode = (id, position) => ({ type: "node/move", id, position });
exports.moveNode = moveNode;
const deleteNode = (id) => ({
    type: "node/delete",
    id,
});
exports.deleteNode = deleteNode;
const createEdge = (source, target) => ({
    type: "edge/create",
    source,
    target,
});
exports.createEdge = createEdge;
const moveEdge = (id, target) => ({
    type: "edge/move",
    id,
    target,
});
exports.moveEdge = moveEdge;
const deleteEdge = (id) => ({
    type: "edge/delete",
    id,
});
exports.deleteEdge = deleteEdge;
//# sourceMappingURL=actions.js.map