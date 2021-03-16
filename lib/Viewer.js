import React, { useCallback, useContext, useLayoutEffect, useMemo, useRef, } from "react";
import { select } from "d3-selection";
import { updateNodes } from "./nodes/readonly.js";
import { updateEdges } from "./edges.js";
import { defaultCanvasUnit, defaultCanvasHeight, SVG_STYLE } from "./utils.js";
import { StyleContext } from "./styles.js";
export function Viewer({ unit = defaultCanvasUnit, height = defaultCanvasHeight, ...props }) {
    return (React.createElement("div", { className: "viewer" },
        React.createElement(Canvas, { unit: unit, height: height, blocks: props.blocks, graph: props.graph, onFocus: props.onFocus, decorateEdges: props.decorateEdges, decorateNodes: props.decorateNodes })));
}
function Canvas(props) {
    const ref = useMemo(() => ({
        nodes: select(null),
        edges: select(null),
        unit: props.unit,
        height: props.height,
        blocks: props.blocks,
        graph: props.graph,
        onFocus: props.onFocus,
        decorateEdges: props.decorateEdges,
        decorateNodes: props.decorateNodes,
    }), []);
    ref.graph = props.graph;
    const svgRef = useRef(null);
    const nodesRef = useCallback((nodes) => {
        ref.nodes = select(nodes);
    }, []);
    const edgesRef = useCallback((edges) => {
        ref.edges = select(edges);
    }, []);
    const update = useMemo(() => ({ nodes: updateNodes(ref), edges: updateEdges(ref) }), []);
    useLayoutEffect(() => void update.nodes(), [props.graph.nodes]);
    useLayoutEffect(() => void update.edges(), [
        props.graph.edges,
        props.graph.nodes,
    ]);
    const style = useContext(StyleContext);
    const { svgStyle, canvasStyle } = useMemo(() => ({
        canvasStyle: style.getCanvasStyle(props),
        svgStyle: style.getSVGStyle(props),
    }), [props.unit]);
    const x = useMemo(() => 480 +
        props.unit *
            Object.values(props.graph.nodes).reduce((x, { position }) => Math.max(x, position.x), 0), [props.graph.nodes]);
    const height = props.unit * props.height;
    return (React.createElement("div", { className: "canvas", style: canvasStyle },
        React.createElement("svg", { ref: svgRef, xmlns: "http://www.w3.org/2000/svg", style: { ...svgStyle, minWidth: x }, height: height },
            React.createElement("style", null, SVG_STYLE),
            React.createElement("g", { className: "edges", ref: edgesRef }),
            React.createElement("g", { className: "nodes", ref: nodesRef }))));
}
