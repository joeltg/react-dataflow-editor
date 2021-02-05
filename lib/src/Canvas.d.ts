/// <reference types="react" />
import { Blocks, Node, Edge, Schema } from "./interfaces.js";
export interface CanvasProps<S extends Schema> {
    unit: number;
    dimensions: [number, number];
    blocks: Blocks<S>;
    onChange: (nodes: Map<number, Node<S>>, edges: Map<number, Edge<S>>) => void;
}
export declare function Canvas<S extends Schema>({ unit, dimensions, blocks, onChange, }: CanvasProps<S>): JSX.Element;
