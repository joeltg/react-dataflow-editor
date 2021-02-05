import { Port, Values } from "../interfaces.js";
export declare type SystemAction<K extends string, V extends Values<K>> = UpdateNodeAction<K, V> | CreateNodeAction<K> | MoveNodeAction | DeleteNodeAction | CreateEdgeAction | MoveEdgeAction | DeleteEdgeAction;
export interface UpdateNodeAction<K extends string, V extends Values<K>> {
    type: "node/update";
    id: number;
    value: V[K];
}
export declare const updateNode: <K extends string, V extends Values<K>>(id: number, value: V[K]) => UpdateNodeAction<K, V>;
export interface CreateNodeAction<K extends string> {
    type: "node/create";
    kind: K;
    position: [number, number];
}
export declare const createNode: <K extends string>(kind: K, position: [number, number]) => CreateNodeAction<K>;
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
