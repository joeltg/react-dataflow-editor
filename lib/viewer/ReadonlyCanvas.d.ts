/// <reference types="react" />
import type { EditorState, Kinds, Schema } from "../state.js";
import { FocusAction } from "../actions.js";
export interface ReadonlyCanvasProps<S extends Schema> {
    kinds: Kinds<S>;
    state: EditorState<S>;
    dispatch: (action: FocusAction) => void;
}
export declare function Canvas<S extends Schema>(props: ReadonlyCanvasProps<S>): JSX.Element;
