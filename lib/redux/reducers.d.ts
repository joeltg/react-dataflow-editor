import { Graph, Blocks, Schema } from "../interfaces.js";
import { EditorAction } from "./actions.js";
export declare const makeReducer: <S extends Schema>(blocks: Blocks<S>, initialState?: Graph<S>) => (state: Graph<S> | undefined, action: EditorAction<S>) => Graph<S>;
