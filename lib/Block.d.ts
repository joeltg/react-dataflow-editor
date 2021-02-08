import React from "react";
import { Blocks, Schema } from "./interfaces.js";
export interface BlockContentProps<S extends Schema> {
    id: number;
    blocks: Blocks<S>;
    container: HTMLDivElement;
}
declare function renderBlockContent<S extends Schema>(props: BlockContentProps<S>): React.ReactPortal | null;
export declare const BlockContent: React.MemoExoticComponent<typeof renderBlockContent>;
export {};
