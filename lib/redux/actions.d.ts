import { Position, Schema, Source, Target } from "../interfaces.js";
export declare type EditorAction<S extends Schema> = CreateNodeAction<S> | MoveNodeAction | DeleteNodeAction | CreateEdgeAction<S> | MoveEdgeAction<S> | DeleteEdgeAction;
export declare type CreateNodeAction<S extends Schema> = {
    type: "node/create";
    kind: keyof S;
    position: Position;
};
export declare const createNode: <S extends Schema>(kind: keyof S, position: Position) => CreateNodeAction<S>;
export declare type MoveNodeAction = {
    type: "node/move";
    id: string;
    position: Position;
};
export declare const moveNode: (id: string, position: Position) => MoveNodeAction;
export declare type DeleteNodeAction = {
    type: "node/delete";
    id: string;
};
export declare const deleteNode: (id: string) => DeleteNodeAction;
export declare type CreateEdgeAction<S extends Schema> = {
    type: "edge/create";
    source: Source<S, keyof S>;
    target: Target<S, keyof S>;
};
export declare const createEdge: <S extends Schema>(source: Source<S, keyof S>, target: Target<S, keyof S>) => CreateEdgeAction<S>;
export declare type MoveEdgeAction<S extends Schema> = {
    type: "edge/move";
    id: string;
    target: Target<S, keyof S>;
};
export declare const moveEdge: <S extends Schema>(id: string, target: Target<S, keyof S>) => MoveEdgeAction<S>;
export declare type DeleteEdgeAction = {
    type: "edge/delete";
    id: string;
};
export declare const deleteEdge: (id: string) => DeleteEdgeAction;
