import { BaseType, Selection } from "d3-selection";
import { CanvasRef, Node, Values } from "./interfaces.js";
export declare const updateNodes: <K extends string, V extends Values<K>>(ref: CanvasRef<K, V>) => () => Selection<HTMLDivElement, Node<K, V>, BaseType, unknown>;
