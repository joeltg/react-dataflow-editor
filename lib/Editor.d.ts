/// <reference types="react" />
import { Kinds, EditorState, Schema } from "./state.js";
import { EditorAction } from "./actions.js";
export interface EditorProps<S extends Schema> {
    unit?: number;
    height?: number;
    kinds: Kinds<S>;
    state: EditorState<S>;
    dispatch: (action: EditorAction<S>) => void;
}
export declare function Editor<S extends Schema>({ unit, height, ...props }: EditorProps<S>): JSX.Element;
