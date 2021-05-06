import React, { useContext, useMemo } from "react";
import { GraphNode, makeNodeDragBehavior } from "./Node.js";
import { GraphEdge } from "./Edge.js";
import { portRadius } from "./utils.js";
import { EditorContext } from "./context.js";
import { borderColor, defaultBackgroundColor, StyleContext } from "./styles.js";
import { makeInputDragBehavior } from "./inputDrag.js";
import { makeOutputDragBehavior } from "./outputDrag.js";
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
    const nodeDrag = useMemo(() => {
        if (context.editable) {
            return makeNodeDragBehavior(context, props.kinds, props.dispatch);
        }
    }, []);
    const inputDrag = useMemo(() => {
        if (context.editable) {
            return makeInputDragBehavior(context, props.kinds, props.dispatch);
        }
    }, []);
    const outputDrag = useMemo(() => {
        if (context.editable) {
            return makeOutputDragBehavior(context, props.kinds, props.dispatch);
        }
    }, []);
    // const handleFocus = useCallback((event: React.FocusEvent<SVGSVGElement>) => {
    // 	event.stopPropagation()
    // 	if (!isFocusEqual(context.focusRef.current, null)) {
    // 		props.dispatch(focus(null))
    // 	}
    // }, [])
    const borderWidth = props.state.focus === null ? 1 : 0;
    const boxShadow = `inset 0 0 0 ${borderWidth}px ${borderColor}`;
    return (React.createElement("div", { ref: props.ref, className: "canvas", style: { ...canvasStyle, boxShadow } },
        React.createElement("svg", { ref: context.svgRef, xmlns: "http://www.w3.org/2000/svg", style: { ...svgStyle, minWidth: width }, height: context.unit * context.height },
            React.createElement("g", { className: "edges", ref: context.edgesRef }, Object.values(props.state.edges).map((edge) => (React.createElement(GraphEdge, { key: edge.id, kinds: props.kinds, nodes: props.state.nodes, focus: props.state.focus, edge: edge, dispatch: props.dispatch })))),
            React.createElement("g", { className: "nodes", ref: context.nodesRef }, Object.values(props.state.nodes).map((node) => (React.createElement(GraphNode, { key: node.id, kinds: props.kinds, focus: props.state.focus, node: node, nodeDrag: nodeDrag, inputDrag: inputDrag, outputDrag: outputDrag, dispatch: props.dispatch })))),
            React.createElement("g", { className: "preview", ref: context.previewRef, display: "none", stroke: borderColor, cursor: "grabbing", fill: defaultBackgroundColor },
                React.createElement("path", { strokeWidth: 6, fill: "none", strokeDasharray: "8 6" }),
                React.createElement("circle", { className: "source", r: portRadius, strokeWidth: 4 }),
                React.createElement("circle", { className: "target", r: portRadius, strokeWidth: 4 })))));
}
