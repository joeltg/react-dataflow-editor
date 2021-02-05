import { BaseType, Selection } from "d3-selection";
import { CanvasRef, Node } from "./interfaces.js";
export declare const updateNodes: <V extends Record<string, any>>(ref: CanvasRef<V>) => () => Selection<HTMLDivElement, Node<V>, BaseType, unknown>;
