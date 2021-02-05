/// <reference types="react" />
import { Schema, Node, Edge, Values } from "./interfaces.js";
export interface CanvasProps<V extends Values> {
    unit: number;
    dimensions: [number, number];
    schema: Schema<V>;
    onChange: (nodes: Map<number, Node<V>>, edges: Map<number, Edge>) => void;
}
export declare function Canvas<V extends Values>({ unit, dimensions, schema, onChange, }: CanvasProps<V>): JSX.Element;
