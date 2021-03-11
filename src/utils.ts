import { quadtree } from "d3-quadtree"

import {
	CanvasRef,
	Schema,
	forInputs,
	Target,
	Position,
	Source,
} from "./interfaces.js"

export const blockWidth = 144

export const portRadius = 12
export const portMargin = 12
export const portHeight = portRadius * 2 + portMargin * 2

const inputPortArc = `a ${portRadius} ${portRadius} 0 0 1 0 ${2 * portRadius}`
const inputPort = `v ${portMargin} ${inputPortArc} v ${portMargin}`

export function makeClipPath(
	inputCount: number,
	[width, height]: [number, number]
): string {
	const path = ["M 0 0 V 0"]

	for (let i = 0; i < inputCount; i++) {
		path.push(inputPort)
	}

	path.push(`V ${height} H ${width} V 0 Z`)

	return path.join(" ")
}

export const getKey = ({ id }: { id: string }) => id

export const toTranslate = (x: number, y: number) => `translate(${x}, ${y})`

export const getSourceIndex = <S extends Schema>(
	ref: CanvasRef<S>,
	source: Source<S, keyof S>
) => {
	const { kind } = ref.graph.nodes[source.id]
	const keys = Object.keys(ref.blocks[kind].outputs)
	return keys.indexOf(source.output as string)
}

export const getTargetIndex = <S extends Schema>(
	ref: CanvasRef<S>,
	target: Target<S, keyof S>
) => {
	const { kind } = ref.graph.nodes[target.id]
	const keys = Object.keys(ref.blocks[kind].inputs)
	return keys.indexOf(target.input as string)
}

export function getSourcePosition<S extends Schema>(
	ref: CanvasRef<S>,
	source: Source<S, keyof S>
): [number, number] {
	const {
		position: { x, y },
	} = ref.graph.nodes[source.id]
	const index = getSourceIndex(ref, source)
	const offsetY = getPortOffsetY(index)
	return [x * ref.unit + blockWidth, y * ref.unit + offsetY]
}

export function getTargetPosition<S extends Schema>(
	ref: CanvasRef<S>,
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
	index * portHeight + portMargin + portRadius

export type DropTarget<S extends Schema> = {
	x: number
	y: number
	target: Target<S, keyof S>
}

export const getX = <S extends Schema>({ x }: DropTarget<S>) => x
export const getY = <S extends Schema>({ y }: DropTarget<S>) => y

export function getTargets<S extends Schema>(
	ref: CanvasRef<S>,
	sourceId: string
) {
	const targets: DropTarget<S>[] = []
	for (const node of Object.values(ref.graph.nodes)) {
		if (node.id === sourceId) {
			continue
		} else {
			const { x, y } = node.position
			for (const [index, input] of forInputs(ref.blocks, node.kind)) {
				if (node.inputs[input] === null) {
					targets.push({
						target: { id: node.id, input },
						x: x * ref.unit,
						y: y * ref.unit + getPortOffsetY(index),
					})
				}
			}
		}
	}

	return quadtree(targets, getX, getY)
}

export const snap = (
	[x, y]: [number, number],
	unit: number,
	[X, Y]: [number, number]
): Position => ({
	x: Math.min(X - 1, Math.max(0, Math.round(x / unit))),
	y: Math.min(Y - 1, Math.max(0, Math.round(y / unit))),
})

export const defaultCanvasUnit = 52
export const defaultCanvasDimensions: [number, number] = [12, 12]
