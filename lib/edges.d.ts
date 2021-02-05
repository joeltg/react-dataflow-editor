import { CanvasRef, Edge } from "./interfaces.js";
export declare const updateEdges: <S extends Record<string, {
    value: any;
    inputs: readonly string[];
    outputs: readonly string[];
}>>(ref: CanvasRef<S>) => () => import("d3-selection").Selection<SVGGElement, Edge<S, keyof S, keyof S>, import("d3-selection").BaseType, unknown>;
