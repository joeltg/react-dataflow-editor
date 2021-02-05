import {
	initialSystemState,
	SystemState,
	Schema,
	Values,
} from "../interfaces.js"

import { SystemAction } from "./actions.js"

export const rootReducer = <V extends Values>(
	schema: Schema<V>,
	initialState: SystemState<V> = initialSystemState()
) => (
	state: SystemState<V> = initialState,
	action: SystemAction<V>
): SystemState<V> => {
	if (action.type === "node/update") {
		const { id, value } = action
		const nodes = new Map(state.nodes)
		const node = nodes.get(id)!
		nodes.set(id, { ...node, value })
		return { ...state, nodes }
	} else if (action.type === "node/create") {
		const { kind, position } = action
		const nodes = new Map(state.nodes)
		const { inputs, outputs, initialValue } = schema[kind]
		nodes.set(state.id, {
			id: state.id,
			kind,
			position,
			inputs: Object.fromEntries(inputs.map((input) => [input, null])),
			outputs: Object.fromEntries(outputs.map((output) => [output, new Set()])),
			value: initialValue,
		})
		return { ...state, id: state.id + 1, nodes }
	} else if (action.type === "node/move") {
		const { id, position } = action
		const nodes = new Map(state.nodes)
		nodes.set(id, { ...nodes.get(id)!, position })
		return { ...state, nodes }
	} else if (action.type === "node/delete") {
		const { id } = action
		const { kind, inputs, outputs } = state.nodes.get(id)!
		const nodes = new Map(state.nodes)
		const edges = new Map(state.edges)
		for (const input of schema[kind].inputs) {
			const edgeId = inputs[input]
			if (edgeId !== null) {
				const {
					source: [sourceId, output],
				} = edges.get(edgeId)!
				edges.delete(edgeId)
				const source = nodes.get(sourceId)!
				const outputs = new Set(source.outputs[output])
				outputs.delete(edgeId)
				nodes.set(sourceId, {
					...source,
					outputs: { ...source.outputs, [output]: outputs },
				})
			}
		}
		for (const output of schema[kind].outputs) {
			for (const edgeId of outputs[output]) {
				const {
					target: [targetId, input],
				} = edges.get(edgeId)!
				edges.delete(edgeId)
				const target = nodes.get(targetId)!
				nodes.set(targetId, {
					...target,
					inputs: { ...target.inputs, [input]: null },
				})
			}
		}
		nodes.delete(id)
		return { ...state, nodes, edges }
	} else if (action.type === "edge/create") {
		const { source, target } = action
		const edges = new Map(state.edges)
		edges.set(state.id, { id: state.id, source, target })

		const nodes = new Map(state.nodes)

		const [sourceId, output] = source
		const sourceNode = nodes.get(sourceId)!
		const sourceOutput = new Set(sourceNode.outputs[output])
		sourceOutput.add(state.id)
		nodes.set(sourceId, {
			...sourceNode,
			outputs: { ...sourceNode.outputs, [output]: sourceOutput },
		})

		const [targetId, input] = target
		const targetNode = nodes.get(targetId)!
		nodes.set(targetId, {
			...targetNode,
			inputs: { ...targetNode.inputs, [input]: state.id },
		})

		return { ...state, id: state.id + 1, edges, nodes }
	} else if (action.type === "edge/move") {
		const { id, target } = action
		const edges = new Map(state.edges)
		const edge = edges.get(id)!
		const [fromNodeId, fromInput] = edge.target

		const nodes = new Map(state.nodes)
		const fromNode = nodes.get(fromNodeId)!
		nodes.set(fromNodeId, {
			...fromNode,
			inputs: { ...fromNode.inputs, [fromInput]: null },
		})

		const [toId, toInput] = target
		const toNode = nodes.get(toId)!
		nodes.set(toId, { ...toNode, inputs: { ...toNode.inputs, [toInput]: id } })

		edges.set(id, { ...edge, target })

		return { ...state, edges, nodes }
	} else if (action.type === "edge/delete") {
		const { id } = action
		const edges = new Map(state.edges)
		const edge = edges.get(id)!

		const nodes = new Map(state.nodes)

		const [sourceId, output] = edge.source
		const sourceNode = nodes.get(sourceId)!
		const sourceOutput = new Set(sourceNode.outputs[output])
		sourceOutput.delete(id)
		nodes.set(sourceId, {
			...sourceNode,
			outputs: { ...sourceNode.outputs, [output]: sourceOutput },
		})

		const [targetId, input] = edge.target
		const targetNode = nodes.get(targetId)!
		nodes.set(targetId, {
			...targetNode,
			inputs: { ...targetNode.inputs, [input]: null },
		})

		edges.delete(id)
		return { ...state, edges, nodes }
	} else {
		return state
	}
}
