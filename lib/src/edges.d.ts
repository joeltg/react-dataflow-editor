import { CanvasRef, Edge } from "./interfaces.js";
export declare const updateEdges: <V extends Record<string, any>>(ref: CanvasRef<V>) => () => import("d3-selection").Selection<SVGGElement, Edge, import("d3-selection").BaseType, unknown>;
