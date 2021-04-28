import React, { useCallback, useMemo, useRef, useState } from "react"
import ReactDOM from "react-dom"

import {
	Editor,
	Graph,
	Schema,
	Kinds,
	GetSchema,
	makeReducer,
	EditorAction,
	Node,
} from ".."

const main = document.querySelector("main")

const kinds = {
	add: {
		name: "Addition",
		inputs: { a: null, b: null },
		outputs: { sum: null },
		backgroundColor: "lavender",
	},
	div: {
		name: "Division",
		inputs: { dividend: null, divisor: null },
		outputs: { quotient: null, remainder: null },
		backgroundColor: "darksalmon",
	},
}

function Index<S extends Schema>({
	kinds,
	initialState,
}: {
	kinds: Kinds<S>
	initialState: Graph<S>
}) {
	const [graph, setGraph] = useState(initialState)

	const graphRef = useRef<Graph<S>>(graph)
	graphRef.current = graph

	const reducer = useMemo(() => makeReducer(kinds, initialState), [])
	const dispatch = useCallback(
		(action: EditorAction<S>) => setGraph(reducer(graphRef.current, action)),
		[]
	)

	const handleFocus = useCallback(
		(id: string | null) => console.log("focus", id),
		[]
	)

	const nodesRes = useRef<any>(null)

	return (
		<Editor<S>
			kinds={kinds}
			graph={graph}
			dispatch={dispatch}
			onFocus={handleFocus}
			decorateNodes={(nodes) => {
				console.log("decorating")
				nodesRes.current = nodes
				nodes
					.filter('[data-id="b"]')
					.attr("stroke-width", 3)
					.attr("stroke", "firebrick")
			}}
		/>
	)
}

type S = GetSchema<typeof kinds>

ReactDOM.render(
	<Index<S>
		kinds={kinds}
		initialState={{
			nodes: {
				a: {
					id: "a",
					kind: "add",
					position: { x: 1, y: 1 },
					inputs: { a: null, b: null },
					outputs: { sum: [] },
				},
				b: {
					id: "b",
					kind: "div",
					position: { x: 5, y: 3 },
					inputs: { dividend: null, divisor: null },
					outputs: { quotient: [], remainder: [] },
				},
			},
			edges: {},
		}}
	/>,
	main
)
