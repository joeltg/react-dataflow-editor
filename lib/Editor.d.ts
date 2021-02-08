/// <reference types="react" />
import { Edge, Node, Blocks, EditorState, Schema } from "./interfaces.js";
export interface EditorProps<S extends Schema> {
    unit?: number;
    dimensions: [number, number];
    blocks: Blocks<S>;
    initialState?: EditorState<S>;
    onChange: (nodes: Map<number, Node<S>>, edges: Map<number, Edge<S>>) => void;
}
export declare function Editor<S extends Schema>({ unit, dimensions, blocks, initialState, onChange, }: EditorProps<S>): JSX.Element;
