import { Port, Values } from "../interfaces.js";
export declare type SystemAction<V extends Values> = UpdateNodeAction<V> | CreateNodeAction<V> | MoveNodeAction | DeleteNodeAction | CreateEdgeAction | MoveEdgeAction | DeleteEdgeAction;
export interface UpdateNodeAction<V extends Values> {
    type: "node/update";
    id: number;
    value: V[keyof V];
}
export declare const updateNode: <V extends Record<string, any>>(id: number, value: V[keyof V]) => UpdateNodeAction<V>;
export interface CreateNodeAction<V extends Values> {
    type: "node/create";
    kind: keyof V;
    position: [number, number];
}
export declare const createNode: <V extends Record<string, any>>(kind: keyof V, position: [number, number]) => CreateNodeAction<V>;
export interface MoveNodeAction {
    type: "node/move";
    id: number;
    position: [number, number];
}
export declare const moveNode: (id: number, position: [number, number]) => MoveNodeAction;
export interface DeleteNodeAction {
    type: "node/delete";
    id: number;
}
export declare const deleteNode: (id: number) => DeleteNodeAction;
export interface CreateEdgeAction {
    type: "edge/create";
    source: Port;
    target: Port;
}
export declare const createEdge: (source: Port, target: Port) => CreateEdgeAction;
export interface MoveEdgeAction {
    type: "edge/move";
    id: number;
    target: Port;
}
export declare const moveEdge: (id: number, target: Port) => MoveEdgeAction;
export interface DeleteEdgeAction {
    type: "edge/delete";
    id: number;
}
export declare const deleteEdge: (id: number) => DeleteEdgeAction;
