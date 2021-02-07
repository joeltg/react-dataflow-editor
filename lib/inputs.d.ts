import { BaseType, Selection } from "d3-selection";
import { CanvasRef, Node, Schema, Target } from "./interfaces.js";
export declare type Input<S extends Schema> = {
    index: number;
    target: Target<S, keyof S>;
    value: number;
};
export declare const updateInputPorts: <S extends Record<string, {
    value: any;
    inputs: string;
    outputs: string;
}>>(ref: CanvasRef<S>) => (inputs: Selection<SVGCircleElement, Input<S>, BaseType, Node<S, keyof S>>) => Selection<SVGCircleElement, Input<S>, BaseType, Node<S, keyof S>>;
