import React, { useCallback, useMemo, useRef } from "react"

import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

import { Toolbox } from "./Toolbox.js"
import { Canvas } from "./EditableCanvas.js"

import type { Kinds, EditorState, Schema } from "../state.js"

import { EditorAction, focus } from "../actions.js"
import { CanvasContext } from "../context.js"
import { isFocusEqual } from "../utils.js"
import { Options, defaultOptions } from "../options.js"

export interface EditorProps<S extends Schema> {
	kinds: Kinds<S>
	state: EditorState<S>
	dispatch: (action: EditorAction<S>) => void
	options?: Partial<Options>
}

export function Editor<S extends Schema>(props: EditorProps<S>) {
	const stateRef = useRef(props.state)
	stateRef.current = props.state

	const dispatch = useCallback(
		(action: EditorAction<S>) => props.dispatch(action),
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
			<DndProvider backend={HTML5Backend}>
				<div
					className="editor"
					style={{ display: "flex", flexDirection: "column" }}
				>
					<Toolbox kinds={props.kinds} />
					<Canvas kinds={props.kinds} state={props.state} dispatch={dispatch} />
				</div>
			</DndProvider>
		</CanvasContext.Provider>
	)
}
