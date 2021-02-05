import React, { useCallback, useState } from "react"
import ReactDOM from "react-dom"

import { Editor, Edge, Factory, SystemState, Values, Schema, Node } from ".."

const main = document.querySelector("main")

const s = {
	source: Factory.block({
		name: "Title",
		inputs: ["a", "b"],
		outputs: ["outA", "outB"],
		initialValue: { foo: "cool" },
		backgroundColor: "lavender",
		component(props) {
			return (
				<>
					<h2>Hello</h2>
					<div>neat {props.value.foo}</div>
					<textarea></textarea>
				</>
			)
		},
	}),
	fdjsalfj: Factory.block({
		name: "ANOTHER BOX",
		inputs: ["a"],
		outputs: ["outA", "outB", "outC"],
		initialValue: { checked: false, counter: 0 },
		backgroundColor: "darksalmon",
		component(props) {
			return (
				<>
					<input
						type="checkbox"
						checked={props.value.checked}
						onChange={({ target: { checked } }) =>
							props.setValue({ ...props.value, checked })
						}
					/>
					<select>
						<option>Hello</option>
						<option>World</option>
					</select>
				</>
			)
		},
	}),
}

function Index<V extends Values>({
	schema,
	initialState,
}: {
	schema: Schema<V>
	initialState: SystemState<V>
}) {
	const [nodes, setNodes] = useState(new Map<number, Node<V>>())

	const [edges, setEdges] = useState(new Map<number, Edge>())

	const handleChange = useCallback(
		(nodes: Map<number, Node<V>>, edges: Map<number, Edge>) => {
			setNodes(nodes)
			setEdges(edges)
		},
		[]
	)

	return (
		<Editor<V>
			dimensions={[12, 12]}
			unit={54}
			schema={schema}
			onChange={handleChange}
			initialState={initialState}
		/>
	)
}

ReactDOM.render(
	<Index
		schema={s}
		initialState={{
			nodes: new Map([
				[
					0,
					{
						id: 0,
						kind: "fdjsalfj",
						position: [1, 1],
						value: { checked: true, counter: 9 },
						inputs: { a: null },
						outputs: { outA: new Set(), outB: new Set(), outC: new Set() },
					},
				],
			]),
			edges: new Map(),
			id: 1,
		}}
	/>,
	main
)
