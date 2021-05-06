/// <reference types="react" />
import { EditorAction } from "./actions.js";
import type { EditorState, Kinds, Schema } from "./state.js";
export interface CanvasProps<S extends Schema> {
    kinds: Kinds<S>;
    state: EditorState<S>;
    dispatch: (action: EditorAction<S>) => void;
    ref?: (element: HTMLDivElement | null) => void;
}
export declare function Canvas<S extends Schema>(props: CanvasProps<S>): JSX.Element;
