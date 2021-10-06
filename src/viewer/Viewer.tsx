import React, { useCallback, useMemo, useRef } from "react"

import { Canvas } from "./ReadonlyCanvas.js"

import type { Kinds, EditorState, Schema } from "../state.js"

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
	const stateRef = useRef(props.state)
	stateRef.current = props.state

	const dispatch = useCallback(
		(action: FocusAction) => props.dispatch(action),
		[]
	)

	const context = useMemo<CanvasContext>(() => {
		return {
			options: { ...defaultOptions, ...props.options },
			nodesRef: { current: null },
			edgesRef: { current: null },
			svgRef: { current: null },
			previewRef: { current: null },
			onFocus: (subject) => {
				if (!isFocusEqual(stateRef.current.focus, subject)) {
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
