/// <reference types="react" />
import { Kinds, EditorState, Schema } from "../state.js";
import { EditorAction } from "../actions.js";
import { Options } from "../options.js";
export interface EditorProps<S extends Schema> {
    kinds: Kinds<S>;
    state: EditorState<S>;
    dispatch: (action: EditorAction<S>) => void;
    options?: Partial<Options>;
}
export declare function Editor<S extends Schema>(props: EditorProps<S>): JSX.Element;
