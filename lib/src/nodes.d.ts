import { BaseType, Selection } from "d3-selection";
import { CanvasRef, Node } from "./interfaces.js";
export declare const updateNodes: <S extends Record<string, {
    value: any;
    inputs: readonly string[];
    outputs: readonly string[];
}>>(ref: CanvasRef<S>) => () => Selection<HTMLDivElement, Node<S>, BaseType, unknown>;
