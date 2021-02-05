/// <reference types="react" />
import { Schema, Values } from "./interfaces.js";
export interface AbstractBlockViewProps<K extends string, V extends Values<K>> {
    kind: K;
    schema: Schema<K, V>;
}
export declare function AbstractBlockView<K extends string, V extends Values<K>>({ kind, schema, }: AbstractBlockViewProps<K, V>): JSX.Element;
export interface ToolboxProps<K extends string, V extends Values<K>> {
    schema: Schema<K, V>;
}
export declare function Toolbox<K extends string, V extends Values<K>>({ schema, }: ToolboxProps<K, V>): JSX.Element;
