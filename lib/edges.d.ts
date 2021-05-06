import type { Schema } from "./interfaces.js";
export declare function setEdgePosition(this: SVGGElement, sourcePosition: [number, number], targetPosition: [number, number]): void;
export declare const updateEdges: <S extends Schema>(ref: any) => () => void;
