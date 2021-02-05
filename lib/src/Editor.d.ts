/// <reference types="react" />
import { Edge, Node, Schema, SystemState, Values } from "./interfaces.js";
export interface EditorProps<K extends string, V extends Values<K>> {
    unit?: number;
    dimensions: [number, number];
    schema: Schema<K, V>;
    initialState?: SystemState<K, V>;
    onChange: (nodes: Map<number, Node<K, V>>, edges: Map<number, Edge>) => void;
}
export declare function Editor<K extends string, V extends Values<K>>({ unit, dimensions, schema, initialState, onChange, }: EditorProps<K, V>): JSX.Element;
