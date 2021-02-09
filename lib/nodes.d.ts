/// <reference types="resize-observer-browser" />
import { BaseType, Selection } from "d3-selection";
import { CanvasRef, Node } from "./interfaces.js";
export declare const handleResize: <S extends Record<string, {
    value: any;
    inputs: string;
    outputs: string;
}>>(ref: CanvasRef<S>, entries: readonly ResizeObserverEntry[]) => void;
export declare const updateNodes: <S extends Record<string, {
    value: any;
    inputs: string;
    outputs: string;
}>>(ref: CanvasRef<S>) => () => Selection<SVGGElement, Node<S, keyof S>, BaseType, unknown>;
