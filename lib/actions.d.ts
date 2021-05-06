import type { Focus, Position, Schema, Source, Target } from "./state.js";
export declare type EditorAction<S extends Schema> = CreateNodeAction<S> | MoveNodeAction | DeleteNodeAction | CreateEdgeAction<S> | MoveEdgeAction<S> | DeleteEdgeAction | FocusAction;
export declare type CreateNodeAction<S extends Schema> = {
    type: "node/create";
    id: string;
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
    id: string;
    source: Source<S>;
    target: Target<S>;
};
export declare const createEdge: <S extends Schema>(source: Source<S, keyof S>, target: Target<S, keyof S>) => CreateEdgeAction<S>;
export declare type MoveEdgeAction<S extends Schema> = {
    type: "edge/move";
    id: string;
    target: Target<S>;
};
export declare const moveEdge: <S extends Schema>(id: string, target: Target<S, keyof S>) => MoveEdgeAction<S>;
export declare type DeleteEdgeAction = {
    type: "edge/delete";
    id: string;
};
export declare const deleteEdge: (id: string) => DeleteEdgeAction;
export declare type FocusAction = {
    type: "focus";
    subject: Focus | null;
};
export declare const focus: (subject: Focus | null) => FocusAction;
