import { BaseType, Selection } from "d3-selection";
import { CanvasRef, Node, Schema, Source } from "./interfaces.js";
export declare type Output<S extends Schema> = {
    index: number;
    source: Source<S, keyof S>;
    value: Set<string>;
};
export declare const updateOutputPorts: <S extends Schema>(ref: CanvasRef<S>) => (outputs: Selection<SVGCircleElement, Output<S>, BaseType, Node<S, keyof S>>) => Selection<SVGCircleElement, Output<S>, BaseType, Node<S, keyof S>>;
