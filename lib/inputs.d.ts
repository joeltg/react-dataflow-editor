import { BaseType, Selection } from "d3-selection";
import { CanvasRef, Node, Schema, Target } from "./interfaces.js";
export declare type Input<S extends Schema> = {
    index: number;
    target: Target<S, keyof S>;
    value: string;
};
export declare const updateInputPorts: <S extends Schema>(ref: CanvasRef<S>) => (inputs: Selection<SVGCircleElement, Input<S>, BaseType, Node<S, keyof S>>) => Selection<SVGCircleElement, Input<S>, BaseType, Node<S, keyof S>>;
