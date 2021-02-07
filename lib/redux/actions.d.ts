import { GetValue, ID, Schema, Source, Target } from "../interfaces.js";
export declare type SystemAction<S extends Schema> = UpdateNodeAction<S> | CreateNodeAction<S> | MoveNodeAction | DeleteNodeAction | CreateEdgeAction<S> | MoveEdgeAction<S> | DeleteEdgeAction;
export declare type UpdateNodeAction<S extends Schema> = {
    type: "node/update";
    id: ID;
    value: GetValue<S, keyof S>;
};
export declare const updateNode: <S extends Record<string, {
    value: any;
    inputs: string;
    outputs: string;
}>>(id: ID, value: GetValue<S, keyof S>) => UpdateNodeAction<S>;
export declare type CreateNodeAction<S extends Schema> = {
    type: "node/create";
    kind: keyof S;
    position: [number, number];
};
export declare const createNode: <S extends Record<string, {
    value: any;
    inputs: string;
    outputs: string;
}>>(kind: keyof S, position: [number, number]) => CreateNodeAction<S>;
export declare type MoveNodeAction = {
    type: "node/move";
    id: ID;
    position: [number, number];
};
export declare const moveNode: (id: ID, position: [number, number]) => MoveNodeAction;
export declare type DeleteNodeAction = {
    type: "node/delete";
    id: ID;
};
export declare const deleteNode: (id: ID) => DeleteNodeAction;
export declare type CreateEdgeAction<S extends Schema> = {
    type: "edge/create";
    source: Source<S, keyof S>;
    target: Target<S, keyof S>;
};
export declare const createEdge: <S extends Record<string, {
    value: any;
    inputs: string;
    outputs: string;
}>>(source: Source<S, keyof S>, target: Target<S, keyof S>) => CreateEdgeAction<S>;
export declare type MoveEdgeAction<S extends Schema> = {
    type: "edge/move";
    id: ID;
    target: Target<S, keyof S>;
};
export declare const moveEdge: <S extends Record<string, {
    value: any;
    inputs: string;
    outputs: string;
}>>(id: ID, target: Target<S, keyof S>) => MoveEdgeAction<S>;
export declare type DeleteEdgeAction = {
    type: "edge/delete";
    id: ID;
};
export declare const deleteEdge: (id: ID) => DeleteEdgeAction;
