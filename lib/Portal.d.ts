import React from "react";
import { Blocks, Schema } from "./interfaces.js";
export interface PortalProps<S extends Schema> {
    id: number;
    blocks: Blocks<S>;
    container: SVGForeignObjectElement;
}
export declare const Portal: React.MemoExoticComponent<typeof renderPortal>;
declare function renderPortal<S extends Schema>(props: PortalProps<S>): React.ReactPortal | null;
export {};
