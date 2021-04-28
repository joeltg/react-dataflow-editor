import React from "react"

import type { Selection } from "d3-selection"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

import { Toolbox } from "./Toolbox.js"
import { Canvas } from "./Canvas.js"

import { Kinds, Edge, Graph, Node, Schema } from "./interfaces.js"
import { EditorAction } from "./state/actions.js"
import { defaultCanvasUnit, defaultCanvasHeight } from "./utils.js"

export interface EditorProps<S extends Schema> {
	unit?: number
	height?: number
	kinds: Kinds<S>
	graph: Graph<S>
	dispatch: (action: EditorAction<S>) => void
	onFocus?: (id: string | null) => void
	decorateNodes?: (
		nodes: Selection<SVGGElement, Node<S>, SVGGElement | null, unknown>
	) => void
	decorateEdges?: (
		edges: Selection<SVGGElement, Edge<S>, SVGGElement | null, unknown>
	) => void
}

export function Editor<S extends Schema>({
	unit = defaultCanvasUnit,
	height = defaultCanvasHeight,
	...props
}: EditorProps<S>) {
	return (
		<DndProvider backend={HTML5Backend}>
			<div
				className="editor"
				style={{ display: "flex", flexDirection: "column" }}
			>
				<Toolbox kinds={props.kinds} />
				<Canvas
					unit={unit}
					height={height}
					kinds={props.kinds}
					graph={props.graph}
					dispatch={props.dispatch}
					onFocus={props.onFocus}
					decorateEdges={props.decorateEdges}
					decorateNodes={props.decorateNodes}
				/>
			</div>
		</DndProvider>
	)
}
