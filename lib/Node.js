import React, { useCallback, useContext, useMemo } from "react";
import { select } from "d3-selection";
import { borderColor } from "./styles.js";
import { makeClipPath, nodeHeaderHeight, nodeMarginX, nodeWidth, place, toTranslate, } from "./utils.js";
import { EditorContext } from "./context.js";
import { GraphInput } from "./Input.js";
import { GraphOutput } from "./Output.js";
export function GraphNode(props) {
    const { name, backgroundColor } = props.kinds[props.node.kind];
    const clipPath = useMemo(() => makeClipPath(props.kinds, props.node.kind), []);
    const inputEntries = useMemo(() => Object.entries(props.node.inputs), [props.node.inputs]);
    const outputEntries = useMemo(() => Object.entries(props.node.outputs), [props.node.outputs]);
    const context = useContext(EditorContext);
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
    return (React.createElement("g", { ref: ref, className: isFocused ? "node focus" : "node", "data-id": props.node.id, "data-kind": props.node.kind, "data-position-x": props.node.position.x, "data-position-y": props.node.position.y, stroke: borderColor, strokeWidth: isFocused ? 3 : 1, transform: transform, cursor: "grab", style: { outline: "none" }, onClick: handleClick },
        React.createElement("path", { fill: backgroundColor, d: clipPath }),
        React.createElement("text", { stroke: "none", x: 8, y: 18 }, name),
        props.children,
        React.createElement("line", { stroke: borderColor, strokeWidth: 1, x1: nodeMarginX, y1: nodeHeaderHeight, x2: nodeWidth - nodeMarginX, y2: nodeHeaderHeight }),
        React.createElement("g", { className: "inputs" }, inputEntries.map(([input, value], index) => (React.createElement(GraphInput, { key: input, focus: props.focus, inputDrag: props.inputDrag, id: props.node.id, input: input, index: index, value: value })))),
        React.createElement("g", { className: "outputs", transform: "translate(156, 0)" }, outputEntries.map(([output, values], index) => (React.createElement(GraphOutput, { key: output, focus: props.focus, outputDrag: props.outputDrag, id: props.node.id, output: output, index: index, values: values }))))));
}
