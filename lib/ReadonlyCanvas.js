import React, { useCallback, useContext, useMemo } from "react";
import { GraphNode } from "./Node.js";
import { GraphEdge } from "./Edge.js";
import { EditorContext } from "./context.js";
import { borderColor, StyleContext } from "./styles.js";
export function Canvas(props) {
    const context = useContext(EditorContext);
    const style = useContext(StyleContext);
    const { svgStyle, canvasStyle } = useMemo(() => ({
        canvasStyle: style.getCanvasStyle(context),
        svgStyle: style.getSVGStyle(context),
    }), []);
    const width = useMemo(() => 480 +
        context.unit *
            Object.values(props.state.nodes).reduce((x, { position }) => Math.max(x, position.x), 0), [props.state.nodes]);
    const handleBackgroundClick = useCallback((event) => {
        context.onFocus(null);
    }, []);
    const borderWidth = props.state.focus === null ? 1 : 0;
    const boxShadow = `inset 0 0 0 ${borderWidth}px ${borderColor}`;
    return (React.createElement("div", { className: "canvas", style: { ...canvasStyle, boxShadow } },
        React.createElement("svg", { ref: context.svgRef, xmlns: "http://www.w3.org/2000/svg", style: { ...svgStyle, minWidth: width, userSelect: "none" }, height: context.unit * context.height },
            React.createElement("rect", { className: "background", fill: "transparent", height: context.unit * context.height, style: { minWidth: width, width: "100%" }, onClick: handleBackgroundClick }),
            React.createElement("g", { className: "edges", ref: context.edgesRef }, Object.values(props.state.edges).map((edge) => (React.createElement(GraphEdge, { key: edge.id, kinds: props.kinds, nodes: props.state.nodes, focus: props.state.focus, edge: edge })))),
            React.createElement("g", { className: "nodes", ref: context.nodesRef }, Object.values(props.state.nodes).map((node) => (React.createElement(GraphNode, { key: node.id, kinds: props.kinds, focus: props.state.focus, node: node })))))));
}
