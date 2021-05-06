/// <reference types="react" />
import { Selection } from "d3-selection";
import type { Kinds, Edge, Graph, Node, Schema } from "../interfaces.js";
export interface ViewerProps<S extends Schema> {
    unit?: number;
    height?: number;
    kinds: Kinds<S>;
    graph: Graph<S>;
    onFocus?: (id: string | null) => void;
    decorateNodes?: (nodes: Selection<SVGGElement, Node<S>, SVGGElement | null, unknown>) => void;
    decorateEdges?: (edges: Selection<SVGGElement, Edge<S>, SVGGElement | null, unknown>) => void;
}
export declare function Viewer<S extends Schema>({ unit, height, ...props }: ViewerProps<S>): JSX.Element;
