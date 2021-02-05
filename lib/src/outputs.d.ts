import { BaseType, Selection } from "d3-selection";
import { CanvasRef, Node, Port } from "./interfaces.js";
export declare type Output = {
    index: number;
    source: Port;
    value: Set<number>;
};
export declare const updateOutputPorts: <V extends Record<string, any>>(ref: CanvasRef<V>) => (outputs: Selection<SVGCircleElement, Output, BaseType, Node<V>>) => Selection<SVGCircleElement, Output, BaseType, Node<V>>;
