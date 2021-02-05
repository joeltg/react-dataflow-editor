"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialSystemState = exports.Factory = void 0;
exports.Factory = {
    block: (block) => block,
    schema: (schema) => schema,
};
const initialSystemState = () => ({
    id: 0,
    nodes: new Map(),
    edges: new Map(),
});
exports.initialSystemState = initialSystemState;
//# sourceMappingURL=interfaces.js.map