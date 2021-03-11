import React from "react"

import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

import { Toolbox } from "./Toolbox.js"
import { Canvas } from "./Canvas.js"

import { Blocks, Graph, Schema } from "./interfaces.js"
import { EditorAction } from "./redux/actions.js"
import { defaultCanvasUnit, defaultCanvasDimensions } from "./utils.js"

export interface EditorProps<S extends Schema> {
	unit?: number
	dimensions?: [number, number]
	blocks: Blocks<S>
	graph: Graph<S>
	dispatch: (action: EditorAction<S>) => void
	onFocus: (id: string | null) => void
}

export function Editor<S extends Schema>({
	unit = defaultCanvasUnit,
	dimensions = defaultCanvasDimensions,
	...props
}: EditorProps<S>) {
	return (
		<DndProvider backend={HTML5Backend}>
			<div
				className="editor"
				style={{ display: "flex", flexDirection: "column" }}
			>
				<Toolbox blocks={props.blocks} />
				<Canvas
					unit={unit}
					dimensions={dimensions}
					blocks={props.blocks}
					graph={props.graph}
					dispatch={props.dispatch}
				/>
			</div>
		</DndProvider>
	)
}
