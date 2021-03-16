/// <reference types="react" />
import { Selection } from "d3-selection";
import * as actions from "./redux/actions.js";
import { Graph, Blocks, Schema, Node, Edge } from "./interfaces.js";
export interface CanvasProps<S extends Schema> {
    unit: number;
    height: number;
    blocks: Blocks<S>;
    graph: Graph<S>;
    onFocus?: (id: string | null) => void;
    dispatch: (action: actions.EditorAction<S>) => void;
    decorateNodes?: (nodes: Selection<SVGGElement, Node<S>, SVGGElement | null, unknown>) => void;
    decorateEdges?: (edges: Selection<SVGGElement, Edge<S>, SVGGElement | null, unknown>) => void;
}
export declare function Canvas<S extends Schema>(props: CanvasProps<S>): JSX.Element;
