import React, { useCallback } from "react";
import { select } from "d3-selection";
import { defaultBackgroundColor } from "./styles.js";
import { getPortOffsetY, nodeMarginX, portRadius, toTranslate, } from "./utils.js";
export function GraphOutput(props) {
    const transform = toTranslate([0, getPortOffsetY(props.index)]);
    const ref = useCallback((circle) => {
        if (circle !== null && props.outputDrag) {
            select(circle).call(props.outputDrag);
        }
    }, []);
    const isFocused = props.focus !== null &&
        props.focus.element === "edge" &&
        props.values.includes(props.focus.id);
    return (React.createElement("g", { className: isFocused ? "output focus" : "output", "data-id": props.id, "data-output": props.output, transform: transform, strokeWidth: isFocused ? 3 : undefined },
        React.createElement("text", { textAnchor: "end", stroke: "none", x: -portRadius - nodeMarginX, dominantBaseline: "middle" }, props.output),
        React.createElement("circle", { ref: ref, className: "port", cursor: "grab", fill: defaultBackgroundColor, r: portRadius })));
}
