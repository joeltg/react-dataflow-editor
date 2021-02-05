import { Port, Values } from "../interfaces.js"

export type SystemAction<K extends string, V extends Values<K>> =
	| UpdateNodeAction<K, V>
	| CreateNodeAction<K>
	| MoveNodeAction
	| DeleteNodeAction
	| CreateEdgeAction
	| MoveEdgeAction
	| DeleteEdgeAction

export interface UpdateNodeAction<K extends string, V extends Values<K>> {
	type: "node/update"
	id: number
	value: V[K]
}

export const updateNode = <K extends string, V extends Values<K>>(
	id: number,
	value: V[K]
): UpdateNodeAction<K, V> => ({
	type: "node/update",
	id,
	value,
})

export interface CreateNodeAction<K extends string> {
	type: "node/create"
	kind: K
	position: [number, number]
}

export const createNode = <K extends string>(
	kind: K,
	position: [number, number]
): CreateNodeAction<K> => ({ type: "node/create", kind, position })

export interface MoveNodeAction {
	type: "node/move"
	id: number
	position: [number, number]
}

export const moveNode = (
	id: number,
	position: [number, number]
): MoveNodeAction => ({ type: "node/move", id, position })

export interface DeleteNodeAction {
	type: "node/delete"
	id: number
}

export const deleteNode = (id: number): DeleteNodeAction => ({
	type: "node/delete",
	id,
})

export interface CreateEdgeAction {
	type: "edge/create"
	source: Port
	target: Port
}

export const createEdge = (source: Port, target: Port): CreateEdgeAction => ({
	type: "edge/create",
	source,
	target,
})

export interface MoveEdgeAction {
	type: "edge/move"
	id: number
	target: Port
}

export const moveEdge = (id: number, target: Port): MoveEdgeAction => ({
	type: "edge/move",
	id,
	target,
})

export interface DeleteEdgeAction {
	type: "edge/delete"
	id: number
}

export const deleteEdge = (id: number): DeleteEdgeAction => ({
	type: "edge/delete",
	id,
})
