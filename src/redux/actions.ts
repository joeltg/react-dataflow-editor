import { GetValue, Schema, Source, Target } from "../interfaces.js"

export type SystemAction<S extends Schema> =
	| UpdateNodeAction<S>
	| CreateNodeAction<S>
	| MoveNodeAction
	| DeleteNodeAction
	| CreateEdgeAction<S>
	| MoveEdgeAction<S>
	| DeleteEdgeAction

export interface UpdateNodeAction<S extends Schema> {
	type: "node/update"
	id: number
	value: GetValue<S, keyof S>
}

export const updateNode = <S extends Schema>(
	id: number,
	value: GetValue<S, keyof S>
): UpdateNodeAction<S> => ({
	type: "node/update",
	id,
	value,
})

export interface CreateNodeAction<S extends Schema> {
	type: "node/create"
	kind: keyof S
	position: [number, number]
}

export const createNode = <S extends Schema>(
	kind: keyof S,
	position: [number, number]
): CreateNodeAction<S> => ({ type: "node/create", kind, position })

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

export interface CreateEdgeAction<S extends Schema> {
	type: "edge/create"
	source: Source<S, keyof S>
	target: Target<S, keyof S>
}

export const createEdge = <S extends Schema>(
	source: Source<S, keyof S>,
	target: Target<S, keyof S>
): CreateEdgeAction<S> => ({
	type: "edge/create",
	source,
	target,
})

export interface MoveEdgeAction<S extends Schema> {
	type: "edge/move"
	id: number
	target: Target<S, keyof S>
}

export const moveEdge = <S extends Schema>(
	id: number,
	target: Target<S, keyof S>
): MoveEdgeAction<S> => ({
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
