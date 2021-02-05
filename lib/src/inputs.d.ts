import { BaseType, Selection } from "d3-selection";
import { CanvasRef, Node, Port, Values } from "./interfaces.js";
export declare type Input = {
    index: number;
    target: Port;
    value: number;
};
export declare const updateInputPorts: <K extends string, V extends Values<K>>(ref: CanvasRef<K, V>) => (inputs: Selection<SVGCircleElement, Input, BaseType, Node<K, V>>) => Selection<SVGCircleElement, Input, BaseType, Node<K, V>>;
