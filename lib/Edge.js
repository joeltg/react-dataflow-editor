import React, { useCallback, useContext, useMemo } from "react";
import { getInputOffset, getOutputOffset, makeCurvePath, place, } from "./utils.js";
import { CanvasContext } from "./context.js";
export function GraphEdge(props) {
    const { kinds, nodes, edge } = props;
    const source = nodes[edge.source.id];
    const target = nodes[edge.target.id];
    const context = useContext(CanvasContext);
    const sourcePosition = useMemo(() => {
        const offset = getOutputOffset(kinds, source.kind, edge.source.output);
        return place(context, source.position, offset);
    }, [edge.source, source.position]);
    const targetPosition = useMemo(() => {
        const offset = getInputOffset(kinds, target.kind, edge.target.input);
        return place(context, target.position, offset);
    }, [edge.target, target.position]);
    const path = useMemo(() => makeCurvePath(sourcePosition, targetPosition), [
        sourcePosition,
        targetPosition,
    ]);
    const handleClick = useCallback((event) => {
        context.onFocus({ element: "edge", id: props.edge.id });
    }, []);
    const { borderColor, backgroundColor } = context.options;
    const isFocused = props.focus !== null &&
        props.focus.element === "edge" &&
        props.focus.id === props.edge.id;
    return (React.createElement("g", { className: isFocused ? "edge focus" : "edge", strokeWidth: isFocused ? 12 : 8, "data-id": edge.id, "data-source-id": edge.source.id, "data-source-kind": source.kind, "data-source-output": edge.source.output, "data-target-id": edge.target.id, "data-target-kind": target.kind, "data-target-input": edge.target.input, cursor: "pointer", onClick: handleClick },
        React.createElement("path", { stroke: borderColor, fill: "none", d: path }),
        React.createElement("path", { strokeWidth: 6, stroke: backgroundColor, fill: "none", d: path })));
}
