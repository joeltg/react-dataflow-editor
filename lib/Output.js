import React, { useCallback, useContext, useMemo } from "react";
import { select } from "d3-selection";
import { getOutputIndex, getPortOffsetY, nodeMarginX, portRadius, toTranslate, } from "./utils.js";
import { CanvasContext } from "./context.js";
export function GraphOutput(props) {
    const transform = useMemo(() => {
        const index = getOutputIndex(props.kinds, props.node.kind, props.output);
        const offsetY = getPortOffsetY(index);
        return toTranslate([0, offsetY]);
    }, []);
    const context = useContext(CanvasContext);
    const { backgroundColor } = context.options;
    const ref = useCallback((circle) => {
        if (circle !== null && props.outputDrag) {
            select(circle).call(props.outputDrag);
        }
    }, []);
    const values = props.node.outputs[props.output];
    const isFocused = props.focus !== null &&
        props.focus.element === "edge" &&
        values.includes(props.focus.id);
    return (React.createElement("g", { className: isFocused ? "output focus" : "output", "data-id": props.node.id, "data-output": props.output, transform: transform, strokeWidth: isFocused ? 3 : undefined },
        React.createElement("text", { textAnchor: "end", stroke: "none", x: -portRadius - nodeMarginX, dominantBaseline: "middle" }, props.output),
        React.createElement("circle", { ref: ref, className: "port", cursor: "grab", fill: backgroundColor, r: portRadius })));
}
