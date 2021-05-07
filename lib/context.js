import { createContext } from "react";
import { defaultOptions } from "./options.js";
export const CanvasContext = createContext({
    options: defaultOptions,
    svgRef: { current: null },
    nodesRef: { current: null },
    edgesRef: { current: null },
    previewRef: { current: null },
    onFocus: (subject) => { },
});
