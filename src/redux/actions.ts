import { Position, Schema, Source, Target } from "../interfaces.js"

export type EditorAction<S extends Schema> =
	| CreateNodeAction<S>
	| MoveNodeAction
	| DeleteNodeAction
	| CreateEdgeAction<S>
	| MoveEdgeAction<S>
	| DeleteEdgeAction

export type CreateNodeAction<S extends Schema> = {
	type: "node/create"
	kind: keyof S
	position: Position
}

export const createNode = <S extends Schema>(
	kind: keyof S,
	position: Position
): CreateNodeAction<S> => ({ type: "node/create", kind, position })

export type MoveNodeAction = {
	type: "node/move"
	id: string
	position: Position
}

export const moveNode = (id: string, position: Position): MoveNodeAction => ({
	type: "node/move",
	id,
	position,
})

export type DeleteNodeAction = { type: "node/delete"; id: string }

export const deleteNode = (id: string): DeleteNodeAction => ({
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
	id: string
	target: Target<S, keyof S>
}

export const moveEdge = <S extends Schema>(
	id: string,
	target: Target<S, keyof S>
): MoveEdgeAction<S> => ({
	type: "edge/move",
	id,
	target,
})

export type DeleteEdgeAction = { type: "edge/delete"; id: string }

export const deleteEdge = (id: string): DeleteEdgeAction => ({
	type: "edge/delete",
	id,
})
