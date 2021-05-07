import React, { useCallback, useMemo, useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Toolbox } from "./Toolbox.js";
import { Canvas } from "./EditableCanvas.js";
import { focus } from "../actions.js";
import { CanvasContext } from "../context.js";
import { isFocusEqual } from "../utils.js";
import { defaultOptions } from "../options.js";
export function Editor(props) {
    const dispatchRef = useRef(props.dispatch);
    dispatchRef.current = props.dispatch;
    const dispatch = useCallback((action) => dispatchRef.current(action), []);
    const focusRef = useRef(props.state.focus);
    focusRef.current = props.state.focus;
    const context = useMemo(() => {
        return {
            options: { ...defaultOptions, ...props.options },
            nodesRef: { current: null },
            edgesRef: { current: null },
            svgRef: { current: null },
            previewRef: { current: null },
            onFocus: (subject) => {
                if (!isFocusEqual(focusRef.current, subject)) {
                    dispatch(focus(subject));
                }
            },
        };
    }, []);
    return (React.createElement(CanvasContext.Provider, { value: context },
        React.createElement(DndProvider, { backend: HTML5Backend },
            React.createElement("div", { className: "editor", style: { display: "flex", flexDirection: "column" } },
                React.createElement(Toolbox, { kinds: props.kinds }),
                React.createElement(Canvas, { kinds: props.kinds, state: props.state, dispatch: dispatch })))));
}
