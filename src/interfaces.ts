import React from "react"

import { Selection } from "d3-selection"

import { Dispatch } from "redux"

import { SystemAction } from "./redux/actions.js"

export const Factory = {
	block: <T>(block: Block<T>) => block,
	schema: <K extends string, S extends { [k in K]: Block<any> }>(
		schema: S
	): Schema<K, GetValues<K, S>> => schema,
}

export type GetValues<K extends string, S extends { [k in K]: Block<any> }> = {
	[k in K]: S[k] extends Block<infer T> ? T : never
}

export type GetNode<
	K extends string,
	S extends { [k in K]: Block<any> }
> = Node<K, GetValues<K, S>>

export type Block<T> = {
	name: string
	inputs: string[]
	outputs: string[]
	initialValue: T
	backgroundColor: string
	component: React.FC<{ value: T; setValue(value: T): void }>
}

export type Values<K extends string> = { [k in K]: any }

export type Schema<K extends string, V extends Values<K>> = {
	[k in K]: Block<V[k]>
}

export type Node<K extends string, V extends Values<K>> = {
	id: number
	position: [number, number]
	inputs: Record<string, null | number>
	outputs: Record<string, Set<number>>
} & { [k in K]: { kind: k; value: V[k] } }[K]

export type Port = [number, string]

export type Edge = {
	id: number
	source: Port
	target: Port
}

export interface SystemState<K extends string, V extends Values<K>> {
	id: number
	nodes: Map<number, Node<K, V>>
	edges: Map<number, Edge>
}

export const initialSystemState = <
	K extends string,
	V extends Values<K>
>(): SystemState<K, V> => ({
	id: 0,
	nodes: new Map(),
	edges: new Map(),
})

export interface CanvasRef<K extends string, V extends Values<K>> {
	svg: Selection<SVGSVGElement | null, unknown, null, undefined>
	contentDimensions: Map<number, [number, number]>
	canvasDimensions: [number, number]
	nodes: SystemState<K, V>["nodes"]
	edges: SystemState<K, V>["edges"]
	unit: number
	schema: Schema<K, V>
	dimensions: [number, number]
	dispatch: Dispatch<SystemAction<K, V>>
}
