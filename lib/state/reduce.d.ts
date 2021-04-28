import type { Graph, Kinds, Schema } from "../interfaces.js";
import { EditorAction } from "./actions.js";
export declare const makeReducer: <S extends Schema>(kinds: Kinds<S>, initialState?: Graph<S>) => (state: Graph<S> | undefined, action: EditorAction<S>) => Graph<S>;
