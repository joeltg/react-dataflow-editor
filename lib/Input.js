import React, { useCallback, useContext, useMemo } from "react";
import { select } from "d3-selection";
import { CanvasContext } from "./context.js";
import { getInputIndex, getPortOffsetY, nodeMarginX, portRadius, toTranslate, } from "./utils.js";
export function GraphInput(props) {
    const transform = useMemo(() => {
        const index = getInputIndex(props.kinds, props.node.kind, props.input);
        const offsetY = getPortOffsetY(index);
        return toTranslate([0, offsetY]);
    }, []);
    const context = useContext(CanvasContext);
    const { backgroundColor } = context.options;
    const ref = useCallback((circle) => {
        if (circle !== null && props.inputDrag) {
            select(circle).call(props.inputDrag);
        }
    }, []);
    const value = props.node.inputs[props.input];
    const handleClick = useCallback((event) => {
        event.stopPropagation();
        if (value !== null) {
            context.onFocus({ element: "edge", id: value });
        }
    }, [value]);
    const isFocused = props.focus !== null &&
        props.focus.element === "edge" &&
        props.focus.id === value;
    return (React.createElement("g", { className: isFocused ? "input focus" : "input", "data-id": props.node.id, "data-input": props.input, "data-value": value, transform: transform, strokeWidth: isFocused ? 3 : undefined },
        React.createElement("text", { stroke: "none", x: portRadius + nodeMarginX, dominantBaseline: "middle" }, props.input),
        React.createElement("circle", { ref: ref, className: "port", cursor: "grab", display: value === null ? "none" : "inherit", fill: backgroundColor, r: portRadius, onClick: handleClick })));
}
