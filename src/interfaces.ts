import React from "react"

import { Selection } from "d3-selection"

import { Dispatch } from "redux"

import { SystemAction } from "./redux/actions.js"

export const Factory = {
	block: <T>(block: Block<T>) => block,
	schema: <S extends Record<string, Block<any>>>(
		schema: S
	): Schema<
		{
			[k in keyof S]: S[k] extends Block<infer T> ? T : never
		}
	> => schema,
}

export type Block<T> = {
	name: string
	inputs: string[]
	outputs: string[]
	initialValue: T
	backgroundColor: string
	component: React.FC<{ value: T; setValue(value: T): void }>
}

export type Values = Record<string, any>

export type Schema<V extends Values> = {
	[k in keyof V]: Block<V[k]>
}

export type Node<V extends Values> = {
	id: number
	position: [number, number]
	inputs: Record<string, null | number>
	outputs: Record<string, Set<number>>
} & { [k in keyof V]: { kind: k; value: V[k] } }[keyof V]

export type Port = [number, string]

export type Edge = {
	id: number
	source: Port
	target: Port
}

export interface SystemState<V extends Values> {
	id: number
	nodes: Map<number, Node<V>>
	edges: Map<number, Edge>
}

export const initialSystemState = <V extends Values>(): SystemState<V> => ({
	id: 0,
	nodes: new Map(),
	edges: new Map(),
})

export interface CanvasRef<V extends Values> {
	svg: Selection<SVGSVGElement | null, unknown, null, undefined>
	contentDimensions: Map<number, [number, number]>
	canvasDimensions: [number, number]
	nodes: SystemState<V>["nodes"]
	edges: SystemState<V>["edges"]
	unit: number
	schema: Schema<V>
	dimensions: [number, number]
	dispatch: Dispatch<SystemAction<V>>
}
