/// <reference types="react" />
import { Blocks, Edge, Graph, Node, Schema } from "./interfaces.js";
import { EditorAction } from "./redux/actions.js";
import { Selection } from "d3-selection";
export interface EditorProps<S extends Schema> {
    unit?: number;
    height?: number;
    blocks: Blocks<S>;
    graph: Graph<S>;
    dispatch: (action: EditorAction<S>) => void;
    onFocus?: (id: string | null) => void;
    decorateNodes?: (nodes: Selection<SVGGElement, Node<S>, SVGGElement | null, unknown>) => void;
    decorateEdges?: (edges: Selection<SVGGElement, Edge<S>, SVGGElement | null, unknown>) => void;
}
export declare function Editor<S extends Schema>({ unit, height, ...props }: EditorProps<S>): JSX.Element;
