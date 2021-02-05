import { GetValue, Schema, Source, Target } from "../interfaces.js";
export declare type SystemAction<S extends Schema> = UpdateNodeAction<S> | CreateNodeAction<S> | MoveNodeAction | DeleteNodeAction | CreateEdgeAction<S> | MoveEdgeAction<S> | DeleteEdgeAction;
export interface UpdateNodeAction<S extends Schema> {
    type: "node/update";
    id: number;
    value: GetValue<S, keyof S>;
}
export declare const updateNode: <S extends Record<string, {
    value: any;
    inputs: readonly string[];
    outputs: readonly string[];
}>>(id: number, value: GetValue<S, keyof S>) => UpdateNodeAction<S>;
export interface CreateNodeAction<S extends Schema> {
    type: "node/create";
    kind: keyof S;
    position: [number, number];
}
export declare const createNode: <S extends Record<string, {
    value: any;
    inputs: readonly string[];
    outputs: readonly string[];
}>>(kind: keyof S, position: [number, number]) => CreateNodeAction<S>;
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
export interface CreateEdgeAction<S extends Schema> {
    type: "edge/create";
    source: Source<S, keyof S>;
    target: Target<S, keyof S>;
}
export declare const createEdge: <S extends Record<string, {
    value: any;
    inputs: readonly string[];
    outputs: readonly string[];
}>>(source: Source<S, keyof S>, target: Target<S, keyof S>) => CreateEdgeAction<S>;
export interface MoveEdgeAction<S extends Schema> {
    type: "edge/move";
    id: number;
    target: Target<S, keyof S>;
}
export declare const moveEdge: <S extends Record<string, {
    value: any;
    inputs: readonly string[];
    outputs: readonly string[];
}>>(id: number, target: Target<S, keyof S>) => MoveEdgeAction<S>;
export interface DeleteEdgeAction {
    type: "edge/delete";
    id: number;
}
export declare const deleteEdge: (id: number) => DeleteEdgeAction;
