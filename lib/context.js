import { createContext } from "react";
export const defaultCanvasUnit = 52;
export const defaultCanvasHeight = 12;
export const EditorContext = createContext({
    unit: defaultCanvasUnit,
    height: defaultCanvasHeight,
    editable: false,
    svgRef: { current: null },
    nodesRef: { current: null },
    edgesRef: { current: null },
    previewRef: { current: null },
    onFocus: (subject) => { },
});
