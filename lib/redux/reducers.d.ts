import { EditorState, Blocks } from "../interfaces.js";
import { EditorAction } from "./actions.js";
export declare const rootReducer: <S extends Record<string, {
    value: any;
    inputs: string;
    outputs: string;
}>>(blocks: Blocks<S>, initialState?: EditorState<S>) => (state: EditorState<S> | undefined, action: EditorAction<S>) => EditorState<S>;
