import React from "react"

import { Selection } from "d3-selection"

import { Dispatch } from "redux"

import { EditorAction } from "./redux/actions.js"

export type ID = number

export type Position = { x: number; y: number }

export const Factory = {
	block: <T, I extends string, O extends string>(block: Block<T, I, O>) =>
		block,
	blocks: <B extends Blocks<Schema>>(blocks: B): Blocks<GetSchema<B>> => blocks,
}

export type Block<T, I extends string, O extends string> = {
	name: string
	inputs: { [i in I]: null }
	outputs: { [o in O]: null }
	initialValue: T
	backgroundColor: string
	component: React.FC<{ value: T; setValue(value: T): void }>
}

export type Schema = Record<
	string,
	{ value: any; inputs: string; outputs: string }
>

export type GetValue<S extends Schema, K extends keyof S> = S[K]["value"]
export type GetInputs<S extends Schema, K extends keyof S> = S[K]["inputs"]
export type GetOutputs<S extends Schema, K extends keyof S> = S[K]["outputs"]

export function* forInputs<S extends Schema, K extends keyof S>(
	blocks: Blocks<S>,
	kind: keyof S
): Generator<[number, GetInputs<S, K>]> {
	for (const entry of Object.keys(blocks[kind].inputs).entries()) {
		yield entry
	}
}

export function* forOutputs<S extends Schema, K extends keyof S>(
	blocks: Blocks<S>,
	kind: keyof S
): Generator<[number, GetOutputs<S, K>]> {
	for (const entry of Object.keys(blocks[kind].outputs).entries()) {
		yield entry
	}
}

export type Blocks<S extends Schema> = {
	[k in keyof S]: Block<GetValue<S, k>, GetInputs<S, k>, GetOutputs<S, k>>
}

export type GetSchema<B extends Blocks<Schema>> = {
	[k in keyof B]: B[k] extends Block<infer T, infer I, infer O>
		? { value: T; inputs: I; outputs: O }
		: never
}

export type Node<S extends Schema, K extends keyof S = keyof S> = {
	id: ID
	position: Position
} & {
	[k in K]: {
		kind: k
		value: GetValue<S, k>
		inputs: Record<GetInputs<S, k>, null | ID>
		outputs: Record<GetOutputs<S, k>, Set<ID>>
	}
}[K]

export type Source<S extends Schema, K extends keyof S> = {
	id: ID
	output: GetOutputs<S, K>
}

export type Target<S extends Schema, K extends keyof S> = {
	id: ID
	input: GetInputs<S, K>
}

export type Edge<
	S extends Schema,
	SK extends keyof S = keyof S,
	TK extends keyof S = keyof S
> = {
	id: ID
	source: Source<S, SK>
	target: Target<S, TK>
}

export type EditorState<S extends Schema> = {
	id: ID
	nodes: Map<number, Node<S>>
	edges: Map<number, Edge<S>>
}

export const initialEditorState = <S extends Schema>(): EditorState<S> => ({
	id: 0,
	nodes: new Map(),
	edges: new Map(),
})

export interface CanvasRef<S extends Schema> {
	svg: Selection<SVGSVGElement | null, unknown, null, undefined>
	contentDimensions: Map<number, [number, number]>
	canvasDimensions: [number, number]
	nodes: EditorState<S>["nodes"]
	edges: EditorState<S>["edges"]
	unit: number
	blocks: Blocks<S>
	dimensions: [number, number]
	dispatch: Dispatch<EditorAction<S>>
}
