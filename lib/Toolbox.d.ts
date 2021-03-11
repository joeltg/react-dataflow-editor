import React from "react";
import { Blocks, Schema } from "./interfaces.js";
export interface AbstractBlockViewProps<S extends Schema> {
    kind: keyof S;
    blocks: Blocks<S>;
}
export declare function AbstractBlockView<S extends Schema>({ kind, blocks, }: AbstractBlockViewProps<S>): JSX.Element;
export interface ToolboxProps<S extends Schema> {
    blocks: Blocks<S>;
}
declare function renderToolbox<S extends Schema>({ blocks }: ToolboxProps<S>): JSX.Element;
export declare const Toolbox: React.MemoExoticComponent<typeof renderToolbox>;
export {};
