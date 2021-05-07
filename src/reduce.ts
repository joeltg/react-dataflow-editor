import type {
	EditorState,
	Kinds,
	Schema,
	Node,
	GetInputs,
	GetOutputs,
	Position,
} from "./state.js"

import {
	forInputs,
	forOutputs,
	isFocusEqual,
	signalInvalidType,
} from "./utils.js"

import { EditorAction } from "./actions.js"

export function reduce<S extends Schema>(
	kinds: Kinds<S>,
	state: EditorState<S>,
	action: EditorAction<S>
): EditorState<S> {
	if (action.type === "node/create") {
		const { id, kind, position } = action
		const nodes = { ...state.nodes }
		nodes[id] = createInitialNode(kinds, id, kind, position)
		return { ...state, nodes, focus: { element: "node", id } }
	} else if (action.type === "node/move") {
		const { id, position } = action
		const node = { ...state.nodes[id], position }
		const nodes = { ...state.nodes, [id]: node }
		return { ...state, nodes, focus: { element: "node", id } }
	} else if (action.type === "node/delete") {
		const { id } = action
		const { kind, inputs, outputs } = state.nodes[id]
		const nodes = { ...state.nodes }
		const edges = { ...state.edges }
		for (const input of forInputs(kinds, kind)) {
			const edgeId: null | string = inputs[input]
			if (edgeId !== null) {
				const {
					source: { id: sourceId, output },
				} = edges[edgeId]
				delete edges[edgeId]
				const source = nodes[sourceId]
				const outputs = new Set(source.outputs[output])
				outputs.delete(edgeId)
				nodes[sourceId] = {
					...source,
					outputs: { ...source.outputs, [output]: Array.from(outputs) },
				}
			}
		}

		for (const output of forOutputs(kinds, kind)) {
			for (const edgeId of outputs[output]) {
				const {
					target: { id: targetId, input },
				} = edges[edgeId]
				delete edges[edgeId]
				const target = nodes[targetId]
				nodes[targetId] = {
					...target,
					inputs: { ...target.inputs, [input]: null },
				}
			}
		}

		delete nodes[id]

		const focus = isFocusEqual(state.focus, { element: "node", id })
			? null
			: state.focus

		return { ...state, nodes, edges, focus }
	} else if (action.type === "edge/create") {
		const { id, source, target } = action
		const edges = { ...state.edges }

		edges[id] = { id, source, target }

		const nodes = { ...state.nodes }

		const { id: sourceId, output } = source
		const sourceNode = nodes[sourceId]
		const sourceOutput = new Set(sourceNode.outputs[output])
		sourceOutput.add(id)
		nodes[sourceId] = {
			...sourceNode,
			outputs: { ...sourceNode.outputs, [output]: Array.from(sourceOutput) },
		}

		const { id: targetId, input } = target
		const targetNode = nodes[targetId]
		nodes[targetId] = {
			...targetNode,
			inputs: { ...targetNode.inputs, [input]: id },
		}

		return { ...state, edges, nodes, focus: { element: "edge", id } }
	} else if (action.type === "edge/move") {
		const { id, target } = action
		const edges = { ...state.edges }
		const edge = edges[id]
		const { id: fromNodeId, input: fromInput } = edge.target

		const nodes = { ...state.nodes }
		const fromNode = nodes[fromNodeId]
		nodes[fromNodeId] = {
			...fromNode,
			inputs: { ...fromNode.inputs, [fromInput]: null },
		}

		const { id: toId, input: toInput } = target
		const toNode = nodes[toId]
		nodes[toId] = { ...toNode, inputs: { ...toNode.inputs, [toInput]: id } }

		edges[id] = { ...edge, target }

		return { ...state, edges, nodes, focus: { element: "edge", id } }
	} else if (action.type === "edge/delete") {
		const { id } = action
		const edges = { ...state.edges }
		const edge = edges[id]

		const nodes = { ...state.nodes }

		const { id: sourceId, output } = edge.source
		const sourceNode = nodes[sourceId]
		const sourceOutput = new Set(sourceNode.outputs[output])
		sourceOutput.delete(id)
		nodes[sourceId] = {
			...sourceNode,
			outputs: { ...sourceNode.outputs, [output]: Array.from(sourceOutput) },
		}

		const { id: targetId, input } = edge.target
		const targetNode = nodes[targetId]
		nodes[targetId] = {
			...targetNode,
			inputs: { ...targetNode.inputs, [input]: null },
		}

		delete edges[id]

		const focus = isFocusEqual(state.focus, { element: "edge", id })
			? null
			: state.focus

		return { ...state, edges, nodes, focus }
	} else if (action.type === "focus") {
		if (action.subject !== null) {
			if (action.subject.element === "node") {
				if (!(action.subject.id in state.nodes)) {
					console.error(action.subject)
					throw new Error("Invalid focus node subject")
				}
			} else if (action.subject.element === "edge") {
				if (!(action.subject.id in state.edges)) {
					console.error(action.subject)
					throw new Error("Invalid focus edge subject")
				}
			}
		}
		return { ...state, focus: action.subject }
	} else {
		signalInvalidType(action)
	}
}

function createInitialNode<S extends Schema>(
	kinds: Kinds<S>,
	id: string,
	kind: keyof S,
	position: Position
): Node<S> {
	const inputs = Object.fromEntries(
		Object.keys(kinds[kind].inputs).map((input) => [input, null])
	) as Record<GetInputs<S>, null | string>

	const outputs = Object.fromEntries(
		Object.keys(kinds[kind].outputs).map<[GetOutputs<S>, string[]]>(
			(output) => [output, []]
		)
	) as Record<GetOutputs<S>, string[]>

	return { id, kind, position, inputs, outputs }
}
