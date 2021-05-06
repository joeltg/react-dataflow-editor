import type { EditorState, Kinds, Schema } from "./state.js";
import { EditorAction } from "./actions.js";
export declare function reduce<S extends Schema>(kinds: Kinds<S>, state: EditorState<S>, action: EditorAction<S>): EditorState<S>;
