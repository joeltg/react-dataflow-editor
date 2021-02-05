import React, { useMemo } from "react"

import { createStore } from "redux"
import { Provider as StoreProvider } from "react-redux"

import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

import { Toolbox } from "./Toolbox.js"

import { Edge, Node, Blocks, SystemState, Schema } from "./interfaces.js"
import { defaultCanvasUnit } from "./utils.js"

import { rootReducer } from "./redux/reducers.js"

import { Canvas } from "./Canvas.js"

export interface EditorProps<S extends Schema> {
	unit?: number
	dimensions: [number, number]
	blocks: Blocks<S>
	initialState?: SystemState<S>
	onChange: (nodes: Map<number, Node<S>>, edges: Map<number, Edge<S>>) => void
}

export function Editor<S extends Schema>({
	unit = defaultCanvasUnit,
	dimensions,
	blocks,
	initialState,
	onChange,
}: EditorProps<S>) {
	const store = useMemo(
		() => createStore(rootReducer(blocks, initialState)),
		[]
	)

	return (
		<StoreProvider store={store}>
			<DndProvider backend={HTML5Backend}>
				<div
					className="editor"
					style={{ display: "flex", flexDirection: "column" }}
				>
					<Toolbox blocks={blocks} />
					<Canvas
						blocks={blocks}
						dimensions={dimensions}
						unit={unit}
						onChange={onChange}
					/>
				</div>
			</DndProvider>
		</StoreProvider>
	)
}
