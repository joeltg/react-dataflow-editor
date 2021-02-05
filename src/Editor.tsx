import React, { useMemo } from "react"

import { createStore } from "redux"
import { Provider as StoreProvider } from "react-redux"

import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

import { Toolbox } from "./Toolbox.js"

import { Edge, Node, Schema, SystemState, Values } from "./interfaces.js"
import { defaultCanvasUnit } from "./utils.js"

import { rootReducer } from "./redux/reducers.js"

import { Canvas } from "./Canvas.js"

export interface EditorProps<V extends Values> {
	unit?: number
	dimensions: [number, number]
	schema: Schema<V>
	initialState?: SystemState<V>
	onChange: (nodes: Map<number, Node<V>>, edges: Map<number, Edge>) => void
}

export function Editor<V extends Values>({
	unit = defaultCanvasUnit,
	dimensions,
	schema,
	initialState,
	onChange,
}: EditorProps<V>) {
	const store = useMemo(
		() => createStore(rootReducer(schema, initialState)),
		[]
	)

	return (
		<StoreProvider store={store}>
			<DndProvider backend={HTML5Backend}>
				<div
					className="editor"
					style={{ display: "flex", flexDirection: "column" }}
				>
					<Toolbox schema={schema} />
					<Canvas
						schema={schema}
						dimensions={dimensions}
						unit={unit}
						onChange={onChange}
					/>
				</div>
			</DndProvider>
		</StoreProvider>
	)
}
