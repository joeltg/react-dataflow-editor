import {
	initialEditorState,
	Graph,
	Blocks,
	Schema,
	Node,
	GetInputs,
	GetOutputs,
	Position,
} from "../interfaces.js"

import { forInputs, forOutputs } from "../utils.js"

import { EditorAction } from "./actions.js"

export const makeReducer = <S extends Schema>(
	blocks: Blocks<S>,
	initialState: Graph<S> = initialEditorState()
) => (state: Graph<S> = initialState, action: EditorAction<S>): Graph<S> => {
	if (action.type === "node/create") {
		const { id, kind, position } = action
		const nodes = { ...state.nodes }
		nodes[id] = createInitialNode(blocks, id, kind, position)
		return { ...state, nodes }
	} else if (action.type === "node/move") {
		const { id, position } = action
		const node = { ...state.nodes[id], position }
		const nodes = { ...state.nodes, [id]: node }
		return { ...state, nodes }
	} else if (action.type === "node/delete") {
		const { id } = action
		const { kind, inputs, outputs } = state.nodes[id]
		const nodes = { ...state.nodes }
		const edges = { ...state.edges }
		for (const [_, input] of forInputs(blocks, kind)) {
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

		for (const [_, output] of forOutputs(blocks, kind)) {
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
		return { nodes, edges }
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

		return { edges, nodes }
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

		return { ...state, edges, nodes }
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
		return { edges, nodes }
	} else {
		console.error("Invalid action", action)
		return state
	}
}

function createInitialNode<S extends Schema, K extends keyof S>(
	blocks: Blocks<S>,
	id: string,
	kind: K,
	position: Position
): Node<S> {
	const inputs = Object.fromEntries(
		Object.keys(blocks[kind].inputs).map((input) => [input, null])
	) as Record<GetInputs<S, K>, null | string>

	const outputs = Object.fromEntries(
		Object.keys(blocks[kind].outputs).map<[GetOutputs<S, K>, string[]]>(
			(output) => [output, []]
		)
	) as Record<GetOutputs<S, K>, string[]>

	return { id, kind, position, inputs, outputs }
}
