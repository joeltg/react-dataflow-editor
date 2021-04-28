/// <reference types="react" />
import type { Selection } from "d3-selection";
import { Kinds, Edge, Graph, Node, Schema } from "./interfaces.js";
import { EditorAction } from "./state/actions.js";
export interface EditorProps<S extends Schema> {
    unit?: number;
    height?: number;
    kinds: Kinds<S>;
    graph: Graph<S>;
    dispatch: (action: EditorAction<S>) => void;
    onFocus?: (id: string | null) => void;
    decorateNodes?: (nodes: Selection<SVGGElement, Node<S>, SVGGElement | null, unknown>) => void;
    decorateEdges?: (edges: Selection<SVGGElement, Edge<S>, SVGGElement | null, unknown>) => void;
}
export declare function Editor<S extends Schema>({ unit, height, ...props }: EditorProps<S>): JSX.Element;
