import { CanvasRef, Schema } from "./interfaces.js";
export declare function setEdgePosition(this: SVGGElement, sourcePosition: [number, number], targetPosition: [number, number]): void;
export declare const updateEdges: <S extends Schema>(ref: CanvasRef<S>) => () => void;
