import React, { useCallback, useMemo, useRef } from "react";
import { Canvas } from "./ReadonlyCanvas.js";
import { focus } from "./actions.js";
import { defaultCanvasUnit, defaultCanvasHeight, EditorContext, } from "./context.js";
import { isFocusEqual } from "./utils.js";
export function Viewer({ unit = defaultCanvasUnit, height = defaultCanvasHeight, ...props }) {
    const focusRef = useRef(props.state.focus);
    focusRef.current = props.state.focus;
    const context = useMemo(() => {
        return {
            unit,
            height,
            editable: false,
            nodesRef: { current: null },
            edgesRef: { current: null },
            svgRef: { current: null },
            previewRef: { current: null },
            onFocus: (subject) => {
                if (!isFocusEqual(focusRef.current, subject)) {
                    props.dispatch(focus(subject));
                }
            },
        };
    }, []);
    const dispatch = useCallback((action) => {
        if (action.type === "focus") {
            props.dispatch(action);
        }
    }, [props.dispatch]);
    return (React.createElement(EditorContext.Provider, { value: context },
        React.createElement(Canvas, { kinds: props.kinds, state: props.state, dispatch: dispatch })));
}
