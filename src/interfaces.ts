import React from "react"

import { Selection } from "d3-selection"

import { Dispatch } from "redux"

import { SystemAction } from "./redux/actions.js"

export const Factory = {
	block: <T, I extends readonly string[], O extends readonly string[]>(
		block: Block<T, I, O>
	) => block,
	blocks: <B extends Blocks<Schema>>(blocks: B): Blocks<GetSchema<B>> => blocks,
}

export type Block<
	T,
	I extends readonly string[],
	O extends readonly string[]
> = {
	name: string
	inputs: I
	outputs: O
	initialValue: T
	backgroundColor: string
	component: React.FC<{ value: T; setValue(value: T): void }>
}

export type Schema = Record<
	string,
	{ value: any; inputs: readonly string[]; outputs: readonly string[] }
>

export type GetValue<S extends Schema, K extends keyof S> = S[K]["value"]
export type GetInputs<S extends Schema, K extends keyof S> = S[K]["inputs"]
export type GetOutputs<S extends Schema, K extends keyof S> = S[K]["outputs"]

export function* forInputs<S extends Schema, K extends keyof S>(
	blocks: Blocks<S>,
	kind: keyof S
): Generator<[number, GetInputs<S, K>[number]]> {
	for (const entry of blocks[kind].inputs.entries()) {
		yield entry
	}
}

export function* forOutputs<S extends Schema, K extends keyof S>(
	blocks: Blocks<S>,
	kind: keyof S
): Generator<[number, GetOutputs<S, K>[number]]> {
	for (const entry of blocks[kind].outputs.entries()) {
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

export type Node<S extends Schema> = {
	id: number
	position: [number, number]
} & {
	[k in keyof S]: {
		kind: k
		value: GetValue<S, k>
		inputs: { [input in GetInputs<S, k>[number]]: null | number }
		outputs: { [output in GetOutputs<S, k>[number]]: Set<number> }
	}
}[keyof S]

export type Source<S extends Schema, K extends keyof S> = [
	number,
	GetOutputs<S, K>[number]
]

export type Target<S extends Schema, K extends keyof S> = [
	number,
	GetInputs<S, K>[number]
]

export type Edge<
	S extends Schema,
	SK extends keyof S = keyof S,
	TK extends keyof S = keyof S
> = {
	id: number
	source: Source<S, SK>
	target: Target<S, TK>
}

export interface SystemState<S extends Schema> {
	id: number
	nodes: Map<number, Node<S>>
	edges: Map<number, Edge<S, keyof S, keyof S>>
}

export const initialSystemState = <S extends Schema>(): SystemState<S> => ({
	id: 0,
	nodes: new Map(),
	edges: new Map(),
})

export interface CanvasRef<S extends Schema> {
	svg: Selection<SVGSVGElement | null, unknown, null, undefined>
	contentDimensions: Map<number, [number, number]>
	canvasDimensions: [number, number]
	nodes: SystemState<S>["nodes"]
	edges: SystemState<S>["edges"]
	unit: number
	blocks: Blocks<S>
	dimensions: [number, number]
	dispatch: Dispatch<SystemAction<S>>
}
