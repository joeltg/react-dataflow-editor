import React, { useMemo, useRef } from "react"

import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

import { Toolbox } from "./Toolbox.js"
import { Canvas } from "./EditableCanvas.js"

import { Kinds, EditorState, Schema, Focus } from "./state.js"

import { EditorAction, focus } from "./actions.js"
import {
	defaultCanvasUnit,
	defaultCanvasHeight,
	EditorContext,
} from "./context.js"
import { isFocusEqual } from "./utils.js"

export interface EditorProps<S extends Schema> {
	unit?: number
	height?: number
	kinds: Kinds<S>
	state: EditorState<S>
	dispatch: (action: EditorAction<S>) => void
}

export function Editor<S extends Schema>({
	unit = defaultCanvasUnit,
	height = defaultCanvasHeight,
	...props
}: EditorProps<S>) {
	const focusRef = useRef<Focus | null>(props.state.focus)
	focusRef.current = props.state.focus

	const context = useMemo<EditorContext>(() => {
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
					props.dispatch(focus(subject))
				}
			},
		}
	}, [])

	return (
		<EditorContext.Provider value={context}>
			<DndProvider backend={HTML5Backend}>
				<div
					className="editor"
					style={{ display: "flex", flexDirection: "column" }}
				>
					<Toolbox kinds={props.kinds} />
					<Canvas
						kinds={props.kinds}
						state={props.state}
						dispatch={props.dispatch}
					/>
				</div>
			</DndProvider>
		</EditorContext.Provider>
	)
}
