/// <reference types="react" />
import { Schema, Values } from "./interfaces.js";
export interface AbstractBlockViewProps<V extends Values> {
    kind: keyof V;
    schema: Schema<V>;
}
export declare function AbstractBlockView<V extends Values>({ kind, schema, }: AbstractBlockViewProps<V>): JSX.Element;
export interface ToolboxProps<V extends Values> {
    schema: Schema<V>;
}
export declare function Toolbox<V extends Values>({ schema }: ToolboxProps<V>): JSX.Element;
