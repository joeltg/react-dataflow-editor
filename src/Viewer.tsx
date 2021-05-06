import React, { useCallback, useMemo, useRef } from "react"

import { Canvas } from "./ReadonlyCanvas.js"

import { Kinds, EditorState, Schema, Focus } from "./state.js"

import { EditorAction, focus, FocusAction } from "./actions.js"
import {
	defaultCanvasUnit,
	defaultCanvasHeight,
	EditorContext,
} from "./context.js"
import { isFocusEqual } from "./utils.js"

export interface ViewerProps<S extends Schema> {
	unit?: number
	height?: number
	kinds: Kinds<S>
	state: EditorState<S>
	dispatch: (action: FocusAction) => void
}

export function Viewer<S extends Schema>({
	unit = defaultCanvasUnit,
	height = defaultCanvasHeight,
	...props
}: ViewerProps<S>) {
	const focusRef = useRef<Focus | null>(props.state.focus)
	focusRef.current = props.state.focus

	const context = useMemo<EditorContext>(() => {
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
					props.dispatch(focus(subject))
				}
			},
		}
	}, [])

	const dispatch = useCallback(
		(action: EditorAction<S>) => {
			if (action.type === "focus") {
				props.dispatch(action)
			}
		},
		[props.dispatch]
	)

	return (
		<EditorContext.Provider value={context}>
			<Canvas kinds={props.kinds} state={props.state} dispatch={dispatch} />
		</EditorContext.Provider>
	)
}
