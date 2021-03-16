/// <reference types="react" />
import { Blocks, Graph, Schema } from "./interfaces.js";
export interface ViewerProps<S extends Schema> {
    unit?: number;
    height?: number;
    blocks: Blocks<S>;
    graph: Graph<S>;
    onFocus: (id: string | null) => void;
}
export declare function Viewer<S extends Schema>({ unit, height, ...props }: ViewerProps<S>): JSX.Element;
