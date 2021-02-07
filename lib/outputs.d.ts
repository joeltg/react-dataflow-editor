import { BaseType, Selection } from "d3-selection";
import { CanvasRef, Node, Schema, Source } from "./interfaces.js";
export declare type Output<S extends Schema> = {
    index: number;
    source: Source<S, keyof S>;
    value: Set<number>;
};
export declare const updateOutputPorts: <S extends Record<string, {
    value: any;
    inputs: string;
    outputs: string;
}>>(ref: CanvasRef<S>) => (outputs: Selection<SVGCircleElement, Output<S>, BaseType, Node<S, keyof S>>) => Selection<SVGCircleElement, Output<S>, BaseType, Node<S, keyof S>>;
