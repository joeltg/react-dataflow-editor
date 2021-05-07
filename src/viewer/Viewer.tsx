import React, { useCallback, useMemo, useRef } from "react"

import { Canvas } from "./ReadonlyCanvas.js"

import { Kinds, EditorState, Schema, Focus } from "../state.js"

import { focus, FocusAction } from "../actions.js"
import { CanvasContext } from "../context.js"
import { isFocusEqual } from "../utils.js"
import { Options, defaultOptions } from "../options.js"

export interface ViewerProps<S extends Schema> {
	kinds: Kinds<S>
	state: EditorState<S>
	dispatch: (action: FocusAction) => void
	options?: Partial<Options>
}

export function Viewer<S extends Schema>(props: ViewerProps<S>) {
	const dispatchRef = useRef(props.dispatch)
	dispatchRef.current = props.dispatch

	const dispatch = useCallback(
		(action: FocusAction) => dispatchRef.current(action),
		[]
	)

	const focusRef = useRef<Focus | null>(props.state.focus)
	focusRef.current = props.state.focus

	const context = useMemo<CanvasContext>(() => {
		return {
			options: { ...defaultOptions, ...props.options },
			nodesRef: { current: null },
			edgesRef: { current: null },
			svgRef: { current: null },
			previewRef: { current: null },
			onFocus: (subject) => {
				if (!isFocusEqual(focusRef.current, subject)) {
					dispatch(focus(subject))
				}
			},
		}
	}, [])

	return (
		<CanvasContext.Provider value={context}>
			<Canvas kinds={props.kinds} state={props.state} dispatch={dispatch} />
		</CanvasContext.Provider>
	)
}
