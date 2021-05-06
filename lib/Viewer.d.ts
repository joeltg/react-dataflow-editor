/// <reference types="react" />
import { Kinds, EditorState, Schema } from "./state.js";
import { FocusAction } from "./actions.js";
export interface ViewerProps<S extends Schema> {
    unit?: number;
    height?: number;
    kinds: Kinds<S>;
    state: EditorState<S>;
    dispatch: (action: FocusAction) => void;
}
export declare function Viewer<S extends Schema>({ unit, height, ...props }: ViewerProps<S>): JSX.Element;
