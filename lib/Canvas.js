import React, { useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, } from "react";
import { useDrop } from "react-dnd";
import { select } from "d3-selection";
import * as actions from "./redux/actions.js";
import { attachPreview } from "./preview.js";
import { updateNodes } from "./nodes.js";
import { updateEdges } from "./edges.js";
import { snap } from "./utils.js";
import { defaultBackgroundColor, defaultBorderColor, StyleContext, } from "./styles.js";
const SVG_STYLE = `
g.node circle.port { cursor: grab }
g.node circle.port.hidden { display: none }
g.node > g.outputs > circle.port.dragging { cursor: grabbing }

g.node:focus > path { stroke-width: 3 }

g.edge.hidden { display: none }
g.edge > path.curve {
	stroke: gray;
	stroke-width: 6px;
	fill: none;
}

g.preview.hidden { display: none }
g.preview > path.curve {
	stroke: gray;
	stroke-width: 6px;
	fill: none;
	stroke-dasharray: 8 6;
}
g.preview > circle {
	fill: ${defaultBackgroundColor};
	stroke: ${defaultBorderColor};
	stroke-width: 4px;
}
`;
export function Canvas(props) {
    const dimensions = useRef([Infinity, Infinity]);
    const ref = useMemo(() => ({
        nodes: select(null),
        edges: select(null),
        preview: select(null),
        unit: props.unit,
        dimensions: dimensions.current,
        blocks: props.blocks,
        graph: props.graph,
        dispatch: props.dispatch,
    }), []);
    ref.graph = props.graph;
    const svgRef = useRef(null);
    useEffect(() => {
        const svg = svgRef.current;
        if (svg !== null) {
            const observer = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    if (entry.target === svg) {
                        const { width, height } = entry.contentRect;
                        ref.dimensions = [width, height];
                    }
                }
            });
            observer.observe(svg);
            return () => observer.unobserve(svg);
        }
    }, [svgRef.current]);
    const nodesRef = useCallback((nodes) => {
        ref.nodes = select(nodes);
    }, []);
    const edgesRef = useCallback((edges) => {
        ref.edges = select(edges);
    }, []);
    const previewRef = useCallback((preview) => {
        ref.preview = select(preview);
        ref.preview.call(attachPreview);
    }, []);
    const update = useMemo(() => ({ nodes: updateNodes(ref), edges: updateEdges(ref) }), []);
    useLayoutEffect(() => void update.nodes(), [props.graph.nodes]);
    useLayoutEffect(() => void update.edges(), [
        props.graph.edges,
        props.graph.nodes,
    ]);
    const [{}, drop] = useDrop({
        accept: ["block"],
        drop({ kind }, monitor) {
            const { x, y } = monitor.getSourceClientOffset();
            const { left, top } = svgRef.current.getBoundingClientRect();
            const position = snap([x - left, y - top], props.unit, dimensions.current);
            props.dispatch(actions.createNode(kind, position));
        },
    });
    const style = useContext(StyleContext);
    const { svgStyle, canvasStyle } = useMemo(() => ({
        canvasStyle: style.getCanvasStyle(props),
        svgStyle: style.getSVGStyle(props),
    }), [props.unit]);
    const x = useMemo(() => 480 +
        props.unit *
            Object.values(props.graph.nodes).reduce((x, { position }) => Math.max(x, position.x), 0), [props.graph.nodes]);
    return (React.createElement("div", { ref: drop, className: "canvas", style: canvasStyle },
        React.createElement("svg", { ref: svgRef, xmlns: "http://www.w3.org/2000/svg", style: { ...svgStyle, minWidth: x } },
            React.createElement("style", null, SVG_STYLE),
            React.createElement("g", { className: "edges", ref: edgesRef }),
            React.createElement("g", { className: "nodes", ref: nodesRef }),
            React.createElement("g", { className: "preview", ref: previewRef }))));
}
