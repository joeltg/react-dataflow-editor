import React, { useMemo, useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Toolbox } from "./Toolbox.js";
import { Canvas } from "./EditableCanvas.js";
import { focus } from "./actions.js";
import { defaultCanvasUnit, defaultCanvasHeight, EditorContext, } from "./context.js";
import { isFocusEqual } from "./utils.js";
export function Editor({ unit = defaultCanvasUnit, height = defaultCanvasHeight, ...props }) {
    const focusRef = useRef(props.state.focus);
    focusRef.current = props.state.focus;
    const context = useMemo(() => {
        return {
            unit,
            height,
            editable: true,
            nodesRef: { current: null },
            edgesRef: { current: null },
            svgRef: { current: null },
            previewRef: { current: null },
            focusRef: { current: props.state.focus },
            onFocus: (subject) => {
                if (!isFocusEqual(focusRef.current, subject)) {
                    props.dispatch(focus(subject));
                }
            },
        };
    }, []);
    return (React.createElement(EditorContext.Provider, { value: context },
        React.createElement(DndProvider, { backend: HTML5Backend },
            React.createElement("div", { className: "editor", style: { display: "flex", flexDirection: "column" } },
                React.createElement(Toolbox, { kinds: props.kinds }),
                React.createElement(Canvas, { kinds: props.kinds, state: props.state, dispatch: props.dispatch })))));
}
