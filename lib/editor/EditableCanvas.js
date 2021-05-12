import React, { useCallback, useContext, useMemo } from "react";
import { useDrop } from "react-dnd";
import { createNode, deleteNode } from "../actions.js";
import { GraphNode } from "../Node.js";
import { GraphEdge } from "../Edge.js";
import { makeInputDragBehavior } from "../inputDrag.js";
import { makeOutputDragBehavior } from "../outputDrag.js";
import { makeNodeDragBehavior } from "../nodeDrag.js";
import { getCanvasWidth, nodeWidth, portRadius, snap } from "../utils.js";
import { CanvasContext } from "../context.js";
import { useStyles } from "../styles.js";
export function Canvas(props) {
    const context = useContext(CanvasContext);
    const [{}, drop] = useDrop({
        accept: ["node"],
        drop({ kind }, monitor) {
            const { x, y } = monitor.getSourceClientOffset();
            const { left, top } = context.svgRef.current.getBoundingClientRect();
            const position = snap(context, [x - left, y - top]);
            props.dispatch(createNode(kind, position));
        },
    });
    const styles = useStyles();
    const width = useMemo(() => {
        return getCanvasWidth(context, props.state.nodes);
    }, [props.state.nodes]);
    const nodeDrag = useMemo(() => {
        return makeNodeDragBehavior(context, props.kinds, props.dispatch);
    }, []);
    const inputDrag = useMemo(() => {
        return makeInputDragBehavior(context, props.kinds, props.dispatch);
    }, []);
    const outputDrag = useMemo(() => {
        return makeOutputDragBehavior(context, props.kinds, props.dispatch);
    }, []);
    const handleBackgroundClick = useCallback((event) => {
        context.onFocus(null);
    }, []);
    const { borderColor, backgroundColor, unit, height } = context.options;
    const borderWidth = props.state.focus === null ? 1 : 0;
    const boxShadow = `0 0 0 ${borderWidth}px ${borderColor}`;
    return (React.createElement("div", { ref: drop, className: "canvas", style: { ...styles.canvas, boxShadow } },
        React.createElement("svg", { ref: context.svgRef, xmlns: "http://www.w3.org/2000/svg", style: { ...styles.svg, minWidth: width }, height: unit * height },
            React.createElement("rect", { className: "background", fill: "transparent", height: unit * height, style: { minWidth: width, width: "100%" }, onClick: handleBackgroundClick }),
            React.createElement("g", { className: "edges", ref: context.edgesRef }, Object.values(props.state.edges).map((edge) => (React.createElement(GraphEdge, { key: edge.id, kinds: props.kinds, nodes: props.state.nodes, focus: props.state.focus, edge: edge })))),
            React.createElement("g", { className: "nodes", ref: context.nodesRef }, Object.values(props.state.nodes).map((node) => (React.createElement(GraphNode, { key: node.id, kinds: props.kinds, focus: props.state.focus, node: node, nodeDrag: nodeDrag, inputDrag: inputDrag, outputDrag: outputDrag },
                React.createElement("text", { stroke: "none", fill: borderColor, x: nodeWidth - 20, y: 18, cursor: "pointer", onClick: () => props.dispatch(deleteNode(node.id)) }, "\uD835\uDDB7"))))),
            React.createElement("g", { className: "preview", ref: context.previewRef, display: "none", stroke: borderColor, cursor: "grabbing", fill: backgroundColor },
                React.createElement("path", { strokeWidth: 6, fill: "none", strokeDasharray: "8 6" }),
                React.createElement("circle", { className: "source", r: portRadius, strokeWidth: 4 }),
                React.createElement("circle", { className: "target", r: portRadius, strokeWidth: 4 })))));
}
