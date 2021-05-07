import React, { useCallback, useContext, useMemo } from "react";
import { select } from "d3-selection";
import { makeClipPath, nodeHeaderHeight, nodeMarginX, nodeWidth, place, toTranslate, } from "./utils.js";
import { CanvasContext } from "./context.js";
import { GraphInput } from "./Input.js";
import { GraphOutput } from "./Output.js";
export function GraphNode(props) {
    const { name, backgroundColor, inputs, outputs } = props.kinds[props.node.kind];
    const clipPath = useMemo(() => makeClipPath(props.kinds, props.node.kind), []);
    const context = useContext(CanvasContext);
    const ref = useCallback((g) => {
        if (g !== null && props.nodeDrag) {
            select(g).call(props.nodeDrag);
        }
    }, []);
    const handleClick = useCallback((event) => {
        context.onFocus({ element: "node", id: props.node.id });
    }, []);
    const transform = toTranslate(place(context, props.node.position));
    const isFocused = props.focus !== null &&
        props.focus.element === "node" &&
        props.focus.id === props.node.id;
    const { borderColor } = context.options;
    return (React.createElement("g", { ref: ref, className: isFocused ? "node focus" : "node", "data-id": props.node.id, "data-kind": props.node.kind, "data-position-x": props.node.position.x, "data-position-y": props.node.position.y, stroke: borderColor, strokeWidth: isFocused ? 3 : 1, transform: transform, cursor: "grab", onClick: handleClick },
        React.createElement("path", { fill: backgroundColor, d: clipPath }),
        React.createElement("text", { stroke: "none", x: 8, y: 18 }, name),
        props.children,
        React.createElement("line", { stroke: borderColor, strokeWidth: 1, x1: nodeMarginX, y1: nodeHeaderHeight, x2: nodeWidth - nodeMarginX, y2: nodeHeaderHeight }),
        React.createElement("g", { className: "inputs" }, Object.keys(inputs).map((input) => (React.createElement(GraphInput, { key: input, kinds: props.kinds, focus: props.focus, node: props.node, input: input, inputDrag: props.inputDrag })))),
        React.createElement("g", { className: "outputs", transform: "translate(156, 0)" }, Object.keys(outputs).map((output) => (React.createElement(GraphOutput, { key: output, kinds: props.kinds, focus: props.focus, node: props.node, output: output, outputDrag: props.outputDrag }))))));
}
