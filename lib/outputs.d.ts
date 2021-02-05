import { BaseType, Selection } from "d3-selection";
import { CanvasRef, Node, Port, Values } from "./interfaces.js";
export declare type Output = {
    index: number;
    source: Port;
    value: Set<number>;
};
export declare const updateOutputPorts: <K extends string, V extends Values<K>>(ref: CanvasRef<K, V>) => (outputs: Selection<SVGCircleElement, Output, BaseType, Node<K, V>>) => Selection<SVGCircleElement, Output, BaseType, Node<K, V>>;
