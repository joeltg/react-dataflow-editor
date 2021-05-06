import React from "react";
import { Focus } from "./state";
export declare const defaultCanvasUnit = 52;
export declare const defaultCanvasHeight = 12;
export interface EditorContext {
    unit: number;
    height: number;
    editable: boolean;
    svgRef: React.MutableRefObject<SVGSVGElement | null>;
    nodesRef: React.MutableRefObject<SVGGElement | null>;
    edgesRef: React.MutableRefObject<SVGGElement | null>;
    previewRef: React.MutableRefObject<SVGGElement | null>;
    onFocus: (subject: Focus | null) => void;
}
export declare const EditorContext: React.Context<EditorContext>;
