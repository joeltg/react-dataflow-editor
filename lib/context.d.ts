import React from "react";
import type { Focus } from "./state.js";
import { Options } from "./options.js";
export interface CanvasContext {
    options: Options;
    svgRef: React.MutableRefObject<SVGSVGElement | null>;
    nodesRef: React.MutableRefObject<SVGGElement | null>;
    edgesRef: React.MutableRefObject<SVGGElement | null>;
    previewRef: React.MutableRefObject<SVGGElement | null>;
    onFocus: (subject: Focus | null) => void;
}
export declare const CanvasContext: React.Context<CanvasContext>;
