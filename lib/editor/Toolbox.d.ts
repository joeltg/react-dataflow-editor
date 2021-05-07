/// <reference types="react" />
import type { Kinds, Schema } from "../state.js";
export interface PreviewNodeProps<S extends Schema> {
    kind: keyof S;
    kinds: Kinds<S>;
}
export declare function PreviewNode<S extends Schema>(props: PreviewNodeProps<S>): JSX.Element;
export interface ToolboxProps<S extends Schema> {
    kinds: Kinds<S>;
}
export declare function Toolbox<S extends Schema>(props: ToolboxProps<S>): JSX.Element;
