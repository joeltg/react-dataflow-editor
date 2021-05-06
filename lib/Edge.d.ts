/// <reference types="react" />
import type { Schema, Kinds, Node, Edge, Focus } from "./state.js";
export interface GraphEdgeProps<S extends Schema> {
    kinds: Kinds<S>;
    nodes: Record<string, Node<S>>;
    focus: Focus | null;
    edge: Edge<S>;
}
export declare function GraphEdge<S extends Schema>(props: GraphEdgeProps<S>): JSX.Element;
