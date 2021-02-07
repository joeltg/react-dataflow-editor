import { GetValue, ID, Schema, Source, Target } from "../interfaces.js"

export type SystemAction<S extends Schema> =
	| UpdateNodeAction<S>
	| CreateNodeAction<S>
	| MoveNodeAction
	| DeleteNodeAction
	| CreateEdgeAction<S>
	| MoveEdgeAction<S>
	| DeleteEdgeAction

export type UpdateNodeAction<S extends Schema> = {
	type: "node/update"
	id: ID
	value: GetValue<S, keyof S>
}

export const updateNode = <S extends Schema>(
	id: ID,
	value: GetValue<S, keyof S>
): UpdateNodeAction<S> => ({
	type: "node/update",
	id,
	value,
})

export type CreateNodeAction<S extends Schema> = {
	type: "node/create"
	kind: keyof S
	position: [number, number]
}

export const createNode = <S extends Schema>(
	kind: keyof S,
	position: [number, number]
): CreateNodeAction<S> => ({ type: "node/create", kind, position })

export type MoveNodeAction = {
	type: "node/move"
	id: ID
	position: [number, number]
}

export const moveNode = (
	id: ID,
	position: [number, number]
): MoveNodeAction => ({ type: "node/move", id, position })

export type DeleteNodeAction = { type: "node/delete"; id: ID }

export const deleteNode = (id: ID): DeleteNodeAction => ({
	type: "node/delete",
	id,
})

export type CreateEdgeAction<S extends Schema> = {
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

export type MoveEdgeAction<S extends Schema> = {
	type: "edge/move"
	id: ID
	target: Target<S, keyof S>
}

export const moveEdge = <S extends Schema>(
	id: ID,
	target: Target<S, keyof S>
): MoveEdgeAction<S> => ({
	type: "edge/move",
	id,
	target,
})

export type DeleteEdgeAction = { type: "edge/delete"; id: ID }

export const deleteEdge = (id: ID): DeleteEdgeAction => ({
	type: "edge/delete",
	id,
})
