import { CanvasRef, Edge, Values } from "./interfaces.js";
export declare const updateEdges: <K extends string, V extends Values<K>>(ref: CanvasRef<K, V>) => () => import("d3-selection").Selection<SVGGElement, Edge, import("d3-selection").BaseType, unknown>;
