/// <reference types="react" />
import type { EditorState, Kinds, Schema } from "../state.js";
import { EditorAction } from "../actions.js";
export interface CanvasProps<S extends Schema> {
    kinds: Kinds<S>;
    state: EditorState<S>;
    dispatch: (action: EditorAction<S>) => void;
}
export declare function Canvas<S extends Schema>(props: CanvasProps<S>): JSX.Element;
