import { Port, Values } from "../interfaces.js"

export type SystemAction<V extends Values> =
	| UpdateNodeAction<V>
	| CreateNodeAction<V>
	| MoveNodeAction
	| DeleteNodeAction
	| CreateEdgeAction
	| MoveEdgeAction
	| DeleteEdgeAction

export interface UpdateNodeAction<V extends Values> {
	type: "node/update"
	id: number
	value: V[keyof V]
}

export const updateNode = <V extends Values>(
	id: number,
	value: V[keyof V]
): UpdateNodeAction<V> => ({
	type: "node/update",
	id,
	value,
})

export interface CreateNodeAction<V extends Values> {
	type: "node/create"
	kind: keyof V
	position: [number, number]
}

export const createNode = <V extends Values>(
	kind: keyof V,
	position: [number, number]
): CreateNodeAction<V> => ({ type: "node/create", kind, position })

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
