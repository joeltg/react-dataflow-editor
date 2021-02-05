/// <reference types="react" />
import { Edge, Node, Schema, SystemState, Values } from "./interfaces.js";
export interface EditorProps<V extends Values> {
    unit?: number;
    dimensions: [number, number];
    schema: Schema<V>;
    initialState?: SystemState<V>;
    onChange: (nodes: Map<number, Node<V>>, edges: Map<number, Edge>) => void;
}
export declare function Editor<V extends Values>({ unit, dimensions, schema, initialState, onChange, }: EditorProps<V>): JSX.Element;
