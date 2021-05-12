import React, { useCallback, useContext, useMemo } from "react";
import { GraphNode } from "../Node.js";
import { GraphEdge } from "../Edge.js";
import { CanvasContext } from "../context.js";
import { useStyles } from "../styles.js";
import { getCanvasWidth } from "../utils.js";
export function Canvas(props) {
    const context = useContext(CanvasContext);
    const styles = useStyles();
    const width = useMemo(() => {
        return getCanvasWidth(context, props.state.nodes);
    }, [props.state.nodes]);
    const handleBackgroundClick = useCallback((_) => {
        context.onFocus(null);
    }, []);
    const { borderColor, unit, height } = context.options;
    const borderWidth = props.state.focus === null ? 1 : 0;
    const boxShadow = `0 0 0 ${borderWidth}px ${borderColor}`;
    return (React.createElement("div", { className: "canvas", style: { ...styles.canvas, boxShadow } },
        React.createElement("svg", { ref: context.svgRef, xmlns: "http://www.w3.org/2000/svg", style: { ...styles.svg, minWidth: width }, height: unit * height },
            React.createElement("rect", { className: "background", fill: "transparent", height: unit * height, style: { minWidth: width, width: "100%" }, onClick: handleBackgroundClick }),
            React.createElement("g", { className: "edges", ref: context.edgesRef }, Object.values(props.state.edges).map((edge) => (React.createElement(GraphEdge, { key: edge.id, kinds: props.kinds, nodes: props.state.nodes, focus: props.state.focus, edge: edge })))),
            React.createElement("g", { className: "nodes", ref: context.nodesRef }, Object.values(props.state.nodes).map((node) => (React.createElement(GraphNode, { key: node.id, kinds: props.kinds, focus: props.state.focus, node: node })))))));
}
