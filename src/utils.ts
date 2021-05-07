import { select, Selection } from "d3-selection"

import type {
	Schema,
	Position,
	Kinds,
	GetInputs,
	GetOutputs,
	EditorState,
	Target,
	Source,
	Focus,
	Node,
} from "./state.js"
import type { CanvasContext } from "./context.js"

export const nodeWidth = 156
export const nodeMarginX = 4
export const nodeHeaderHeight = 24
export const portRadius = 12
export const portMargin = 12
export const portHeight = portRadius * 2 + portMargin * 2
export const canvasPaddingRight = 480

const inputPortArc = `a ${portRadius} ${portRadius} 0 0 1 0 ${2 * portRadius}`
const inputPort = `v ${portMargin} ${inputPortArc} v ${portMargin}`

export function signalInvalidType(type: never): never {
	console.error(type)
	throw new Error("Unexpected type")
}

export const initialEditorState = <S extends Schema>(): EditorState<S> => ({
	nodes: {},
	edges: {},
	focus: null,
})

export function makeClipPath<S extends Schema>(
	kinds: Kinds<S>,
	kind: keyof S
): string {
	const { inputs, outputs } = kinds[kind]
	const { length: inputCount } = Object.keys(inputs)
	const { length: outputCount } = Object.keys(outputs)

	const nodeHeight =
		nodeHeaderHeight + portHeight * Math.max(inputCount, outputCount)

	const path = [`M 0 0 V ${nodeHeaderHeight}`]

	for (let i = 0; i < inputCount; i++) {
		path.push(inputPort)
	}

	path.push(`V ${nodeHeight} H ${nodeWidth} V 0 Z`)

	return path.join(" ")
}

export function place(
	{ options }: CanvasContext,
	{ x, y }: Position,
	offset?: [number, number]
): [number, number] {
	if (offset === undefined) {
		return [x * options.unit, y * options.unit]
	} else {
		const [dx, dy] = offset
		return [x * options.unit + dx, y * options.unit + dy]
	}
}

export const toTranslate = ([x, y]: [number, number]) => `translate(${x}, ${y})`

export function getPortOffsetY(index: number) {
	if (index === -1) {
		throw new Error("Invalid port offset index")
	}
	return nodeHeaderHeight + index * portHeight + portMargin + portRadius
}

const keyIndexCache = new WeakMap<
	Record<string, null>,
	Record<string, number>
>()

function getKeyIndex(ports: Record<string, null>, name: string): number {
	const indices = keyIndexCache.get(ports)
	if (indices !== undefined) {
		return indices[name]
	} else {
		const keys = Object.keys(ports)
		const indices = Object.fromEntries(keys.map((key, index) => [key, index]))
		keyIndexCache.set(ports, indices)
		return indices[name]
	}
}

export const getInputIndex = <S extends Schema, K extends keyof S>(
	kinds: Kinds<S>,
	kind: K,
	input: GetInputs<S, K>
) => getKeyIndex(kinds[kind].inputs, input)

export const getOutputIndex = <S extends Schema, K extends keyof S>(
	kinds: Kinds<S>,
	kind: K,
	output: GetOutputs<S, K>
) => getKeyIndex(kinds[kind].outputs, output)

export function getInputOffset<S extends Schema, K extends keyof S>(
	kinds: Kinds<S>,
	kind: K,
	input: GetInputs<S, K>
): [number, number] {
	const index = getInputIndex(kinds, kind, input)
	return [0, getPortOffsetY(index)]
}

export function getOutputOffset<S extends Schema, K extends keyof S>(
	kinds: Kinds<S>,
	kind: K,
	output: GetOutputs<S, K>
): [number, number] {
	const index = getOutputIndex(kinds, kind, output)
	return [nodeWidth, getPortOffsetY(index)]
}

export function getSourcePosition<S extends Schema>(
	context: CanvasContext,
	kinds: Kinds<S>,
	{ id, output }: Source<S>
) {
	const nodes = select(context.nodesRef.current)
	const node = nodes.select<SVGGElement>(`g.node[data-id="${id}"]`)
	const { kind, position } = getNodeAttributes(node)
	const offset = getOutputOffset(kinds, kind, output)
	return place(context, position, offset)
}

export function getTargetPosition<S extends Schema>(
	context: CanvasContext,
	kinds: Kinds<S>,
	{ id, input }: Target<S>
) {
	const nodes = select(context.nodesRef.current)
	const node = nodes.select<SVGGElement>(`g.node[data-id="${id}"]`)
	const { kind, position } = getNodeAttributes(node)
	const offset = getInputOffset(kinds, kind, input)
	return place(context, position, offset)
}

export function* forInputs<S extends Schema, K extends keyof S>(
	kinds: Kinds<S>,
	kind: keyof S
): Generator<GetInputs<S, K>> {
	for (const input of Object.keys(kinds[kind].inputs)) {
		yield input
	}
}

export function* forOutputs<S extends Schema, K extends keyof S>(
	kinds: Kinds<S>,
	kind: keyof S
): Generator<GetOutputs<S, K>> {
	for (const output of Object.keys(kinds[kind].outputs)) {
		yield output
	}
}

export const snap = (
	{ options }: CanvasContext,
	[x, y]: [number, number]
): Position => ({
	x: Math.max(0, Math.round(x / options.unit)),
	y: Math.min(options.height - 1, Math.max(0, Math.round(y / options.unit))),
})

const minCurveExtent = 104
export function makeCurvePath(
	[x1, y1]: [number, number],
	[x2, y2]: [number, number]
): string {
	const dx = x2 - x1
	const mx = x1 + dx / 2
	const dy = y2 - y1
	const my = y1 + dy / 2
	const qx = x1 + Math.max(Math.min(minCurveExtent, Math.abs(dy / 2)), dx / 4)
	return `M ${x1} ${y1} Q ${qx} ${y1} ${mx} ${my} T ${x2} ${y2}`
}

export function getNodeAttributes(
	node: Selection<SVGGElement, unknown, null, undefined>
): { id: string; kind: string; position: Position } {
	const id = node.attr("data-id")
	const kind = node.attr("data-kind")
	const x = parseInt(node.attr("data-position-x"))
	const y = parseInt(node.attr("data-position-y"))

	return { id, kind, position: { x, y } }
}

export function getEdgeSource(
	edge: Selection<SVGGElement, unknown, null, undefined>
): { id: string; output: string; kind: string } {
	return {
		id: edge.attr("data-source-id"),
		output: edge.attr("data-source-output"),
		kind: edge.attr("data-source-kind"),
	}
}

export function getEdgeTarget(
	edge: Selection<SVGGElement, unknown, null, undefined>
): { id: string; input: string; kind: string } {
	return {
		id: edge.attr("data-target-id"),
		input: edge.attr("data-target-input"),
		kind: edge.attr("data-target-kind"),
	}
}

export function isFocusEqual(a: Focus | null, b: Focus | null): boolean {
	if (a === null && b === null) {
		return true
	} else if (a === null || b === null) {
		return false
	} else {
		return a.element === b.element && a.id === b.id
	}
}

export function getCanvasWidth<S extends Schema>(
	{ options }: CanvasContext,
	nodes: Record<string, Node<S>>
) {
	const max = Object.values(nodes).reduce(
		(x, { position }) => Math.max(x, position.x),
		0
	)
	return canvasPaddingRight + options.unit * max
}
