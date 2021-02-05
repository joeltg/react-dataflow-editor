/// <reference types="react" />
import { Schema, Node, Edge, Values } from "./interfaces.js";
export interface CanvasProps<K extends string, V extends Values<K>> {
    unit: number;
    dimensions: [number, number];
    schema: Schema<K, V>;
    onChange: (nodes: Map<number, Node<K, V>>, edges: Map<number, Edge>) => void;
}
export declare function Canvas<K extends string, V extends Values<K>>({ unit, dimensions, schema, onChange, }: CanvasProps<K, V>): JSX.Element;
