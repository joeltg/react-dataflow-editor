/// <reference types="react" />
import { Kinds, EditorState, Schema } from "../state.js";
import { FocusAction } from "../actions.js";
import { Options } from "../options.js";
export interface ViewerProps<S extends Schema> {
    kinds: Kinds<S>;
    state: EditorState<S>;
    dispatch: (action: FocusAction) => void;
    options?: Partial<Options>;
}
export declare function Viewer<S extends Schema>(props: ViewerProps<S>): JSX.Element;
