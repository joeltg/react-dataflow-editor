import { Selection } from "d3-selection"

import type {
	Schema,
	Node,
	Target,
	Position,
	Source,
	Kinds,
	GetInputs,
	GetOutputs,
	ReadonlyCanvasRef,
	Graph,
} from "./interfaces.js"
import { defaultBackgroundColor, defaultBorderColor } from "./styles.js"

export const initialEditorState = <S extends Schema>(): Graph<S> => ({
	nodes: {},
	edges: {},
})

export const nodeWidth = 156
export const nodeHeaderHeight = 24
export const portRadius = 12
export const portMargin = 12
export const portHeight = portRadius * 2 + portMargin * 2

export const SVG_STYLE = `
g.node circle.port { cursor: grab }
g.node circle.port.hidden { display: none }
g.node > g.outputs > circle.port.dragging { cursor: grabbing }

g.node:focus { stroke-width: 3 }

g.edge.hidden { display: none }

g.preview.hidden { display: none }
g.preview > path.curve {
	stroke: gray;
	stroke-width: 6px;
	fill: none;
	stroke-dasharray: 8 6;
}
g.preview > circle {
	fill: ${defaultBackgroundColor};
	stroke: ${defaultBorderColor};
	stroke-width: 4px;
}
`

const inputPortArc = `a ${portRadius} ${portRadius} 0 0 1 0 ${2 * portRadius}`
const inputPort = `v ${portMargin} ${inputPortArc} v ${portMargin}`

export function makeClipPath(
	inputCount: number,
	[width, height]: [number, number]
): string {
	const path = [`M 0 0 V ${nodeHeaderHeight}`]

	for (let i = 0; i < inputCount; i++) {
		path.push(inputPort)
	}

	path.push(`V ${height} H ${width} V 0 Z`)

	return path.join(" ")
}

export const getKey = ({ id }: { id: string }) => id

export const toTranslate = (x: number, y: number) => `translate(${x}, ${y})`

export const getSourceIndex = <S extends Schema>(
	ref: ReadonlyCanvasRef<S>,
	source: Source<S, keyof S>
) => {
	const { kind } = ref.graph.nodes[source.id]
	const keys = Object.keys(ref.kinds[kind].outputs)
	return keys.indexOf(source.output as string)
}

export const getTargetIndex = <S extends Schema>(
	ref: ReadonlyCanvasRef<S>,
	target: Target<S, keyof S>
) => {
	const { kind } = ref.graph.nodes[target.id]
	const keys = Object.keys(ref.kinds[kind].inputs)
	return keys.indexOf(target.input as string)
}

export function getSourcePosition<S extends Schema>(
	ref: ReadonlyCanvasRef<S>,
	source: Source<S, keyof S>
): [number, number] {
	const {
		position: { x, y },
	} = ref.graph.nodes[source.id]
	const index = getSourceIndex(ref, source)
	const offsetY = getPortOffsetY(index)
	return [x * ref.unit + nodeWidth, y * ref.unit + offsetY]
}

export function getTargetPosition<S extends Schema>(
	ref: ReadonlyCanvasRef<S>,
	target: Target<S, keyof S>
): [number, number] {
	const {
		position: { x, y },
	} = ref.graph.nodes[target.id]
	const index = getTargetIndex(ref, target)
	const offsetY = getPortOffsetY(index)
	return [x * ref.unit, y * ref.unit + offsetY]
}

export const getPortOffsetY = (index: number) =>
	nodeHeaderHeight + index * portHeight + portMargin + portRadius

export function* forInputs<S extends Schema, K extends keyof S>(
	kinds: Kinds<S>,
	kind: keyof S
): Generator<[number, GetInputs<S, K>]> {
	for (const entry of Object.keys(kinds[kind].inputs).entries()) {
		yield entry
	}
}

export function* forOutputs<S extends Schema, K extends keyof S>(
	kinds: Kinds<S>,
	kind: keyof S
): Generator<[number, GetOutputs<S, K>]> {
	for (const entry of Object.keys(kinds[kind].outputs).entries()) {
		yield entry
	}
}

export const snap = <S extends Schema>(
	ref: ReadonlyCanvasRef<S>,
	[x, y]: [number, number]
): Position => ({
	x: Math.max(0, Math.round(x / ref.unit)),
	y: Math.min(ref.height - 1, Math.max(0, Math.round(y / ref.unit))),
})

export const defaultCanvasUnit = 52
export const defaultCanvasHeight = 12

export type AttachPorts<S extends Schema> = (
	ports: Selection<SVGGElement, Node<S, keyof S>, SVGGElement | null, unknown>
) => void
