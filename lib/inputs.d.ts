import { BaseType, Selection } from "d3-selection";
import { CanvasRef, Node, Port } from "./interfaces.js";
export declare type Input = {
    index: number;
    target: Port;
    value: number;
};
export declare const updateInputPorts: <K extends string, V extends Record<string, any>>(ref: CanvasRef<V>) => (inputs: Selection<SVGCircleElement, Input, BaseType, Node<V>>) => Selection<SVGCircleElement, Input, BaseType, Node<V>>;
