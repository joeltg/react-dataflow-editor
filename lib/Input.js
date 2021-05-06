import React, { useCallback, useContext } from "react";
import { select } from "d3-selection";
import { defaultBackgroundColor } from "./styles.js";
import { EditorContext } from "./context.js";
import { getPortOffsetY, nodeMarginX, portRadius, toTranslate, } from "./utils.js";
export function GraphInput(props) {
    const transform = toTranslate([0, getPortOffsetY(props.index)]);
    const context = useContext(EditorContext);
    const ref = useCallback((circle) => {
        if (circle !== null && props.inputDrag) {
            select(circle).call(props.inputDrag);
        }
    }, []);
    const handleClick = useCallback((event) => {
        event.stopPropagation();
        if (props.value !== null) {
            context.onFocus({ element: "edge", id: props.value });
        }
    }, [props.value]);
    const isFocused = props.focus !== null &&
        props.focus.element === "edge" &&
        props.focus.id === props.value;
    return (React.createElement("g", { className: isFocused ? "input focus" : "input", "data-id": props.id, "data-input": props.input, "data-value": props.value, transform: transform, strokeWidth: isFocused ? 3 : undefined },
        React.createElement("text", { stroke: "none", x: portRadius + nodeMarginX, dominantBaseline: "middle" }, props.input),
        React.createElement("circle", { ref: ref, className: "port", cursor: "grab", display: props.value === null ? "none" : "inherit", fill: defaultBackgroundColor, r: portRadius, onClick: handleClick })));
}
