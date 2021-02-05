import React, { useMemo } from "react"

import { createStore } from "redux"
import { Provider as StoreProvider } from "react-redux"

import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

import { Toolbox } from "./Toolbox.js"

import {
	Block,
	Edge,
	GetNode,
	GetValues,
	Node,
	Schema,
	SystemState,
	Values,
} from "./interfaces.js"
import { defaultCanvasUnit } from "./utils.js"

import { rootReducer } from "./redux/reducers.js"

import { Canvas } from "./Canvas.js"

export interface EditorProps<
	K extends string,
	V extends Values<K>
	// S extends { [k in K]: Block<any> }
> {
	unit?: number
	dimensions: [number, number]
	// schema: Schema<K, GetValues<K, S>>
	schema: Schema<K, V>
	// initialState?: SystemState<K, GetValues<K, S>>
	initialState?: SystemState<K, V>
	onChange: (
		// nodes: Map<number, GetNode<K, S>>,
		nodes: Map<number, Node<K, V>>,
		edges: Map<number, Edge>
	) => void
}

export function Editor<
	K extends string,
	V extends Values<K>
	// S extends { [k in K]: Block<any> }
>({
	unit = defaultCanvasUnit,
	dimensions,
	schema,
	initialState,
	onChange,
}: // }: EditorProps<K, S>) {
EditorProps<K, V>) {
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
