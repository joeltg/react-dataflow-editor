import React from "react";
import { Options } from "./options.js";
export declare const getCanvasStyle: ({ borderColor, }: Options) => React.CSSProperties;
export declare const getSVGStyle: ({ borderColor, unit, height, }: Options) => React.CSSProperties;
export declare const defaultStyleContext: {
    getCanvasStyle: ({ borderColor, }: Options) => React.CSSProperties;
    getSVGStyle: ({ borderColor, unit, height, }: Options) => React.CSSProperties;
};
export declare const StyleContext: React.Context<{
    getCanvasStyle: ({ borderColor, }: Options) => React.CSSProperties;
    getSVGStyle: ({ borderColor, unit, height, }: Options) => React.CSSProperties;
}>;
export declare function useStyles(): {
    canvas: React.CSSProperties;
    svg: React.CSSProperties;
};
