import React, { useCallback, useRef, useState } from "react"
import ReactDOM from "react-dom"

import {
	Editor,
	Schema,
	Kinds,
	GetSchema,
	EditorAction,
	EditorState,
	reduce,
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
	initialState: EditorState<S>
}) {
	const [state, setState] = useState(initialState)

	const stateRef = useRef<EditorState<S>>(state)
	stateRef.current = state

	const dispatch = useCallback((action: EditorAction<S>) => {
		console.log("dispatch", action)
		setState(reduce(kinds, stateRef.current, action))
	}, [])

	return <Editor<S> kinds={kinds} state={state} dispatch={dispatch} />
}

type S = GetSchema<typeof kinds>

ReactDOM.render(
	<Index<S>
		kinds={kinds}
		initialState={{
			focus: null,
			nodes: {
				a: {
					id: "a",
					kind: "add",
					position: { x: 1, y: 1 },
					inputs: { a: null, b: null },
					outputs: { sum: ["c"] },
				},
				b: {
					id: "b",
					kind: "div",
					position: { x: 5, y: 3 },
					inputs: { dividend: "c", divisor: null },
					outputs: { quotient: [], remainder: [] },
				},
			},
			edges: {
				c: {
					id: "c",
					source: { id: "a", output: "sum" },
					target: { id: "b", input: "dividend" },
				},
			},
		}}
	/>,
	main
)
