import React, { useCallback, useMemo, useRef } from "react";
import { Canvas } from "./ReadonlyCanvas.js";
import { focus } from "../actions.js";
import { CanvasContext } from "../context.js";
import { isFocusEqual } from "../utils.js";
import { defaultOptions } from "../options.js";
export function Viewer(props) {
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
        React.createElement(Canvas, { kinds: props.kinds, state: props.state, dispatch: dispatch })));
}
