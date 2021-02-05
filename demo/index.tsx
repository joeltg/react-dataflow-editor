import React, { useCallback, useState } from "react"
import ReactDOM from "react-dom"

import {
	Editor,
	Edge,
	Factory,
	SystemState,
	Schema,
	Node,
	Blocks,
	GetSchema,
} from ".."

const main = document.querySelector("main")

const blocks = {
	source: Factory.block({
		name: "Title",
		inputs: ["a", "b"] as const,
		outputs: ["outA", "outB"] as const,
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
		inputs: ["a"] as const,
		outputs: ["outA", "outB", "outC"] as const,
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

function Index<S extends Schema>({
	blocks,
	initialState,
}: {
	blocks: Blocks<S>
	initialState: SystemState<S>
}) {
	const [nodes, setNodes] = useState(new Map<number, Node<S>>())

	const [edges, setEdges] = useState(new Map<number, Edge<S>>())

	const handleChange = useCallback(
		(nodes: Map<number, Node<S>>, edges: Map<number, Edge<S>>) => {
			setNodes(nodes)
			setEdges(edges)
		},
		[]
	)

	return (
		<Editor<S>
			dimensions={[12, 12]}
			unit={54}
			blocks={blocks}
			onChange={handleChange}
			initialState={initialState}
		/>
	)
}

type S = GetSchema<typeof blocks>

ReactDOM.render(
	<Index<S>
		blocks={blocks}
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
