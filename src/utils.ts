import { quadtree } from "d3-quadtree"
import { CanvasRef, Edge, Node, Port, Schema, Values } from "./interfaces"

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

export const defaultCanvasUnit = 72

export const defaultBackgroundColor = "lightgray"
export const defaultBorderColor = "dimgray"

export const minWidth = portHeight
export const minHeight = portHeight

export const getKey = ({ id }: { id: number }) => id.toString()

export const toTranslate = (x: number, y: number) => `translate(${x}, ${y})`

export const positionEqual = (
	[x1, y1]: [number, number],
	[x2, y2]: [number, number]
): boolean => x1 === x2 && y1 === y2

export function getSourcePosition<K extends string, V extends Values<K>>(
	ref: CanvasRef<K, V>,
	{ source: [id, output] }: Edge
): [number, number] {
	const {
		kind,
		position: [x, y],
	} = ref.nodes.get(id)!
	const index = ref.schema[kind].outputs.indexOf(output as string)
	const offsetY = getPortOffsetY(index)
	const [offsetX] = ref.contentDimensions.get(id)!
	return [x * ref.unit + offsetX + 2 * portRadius, y * ref.unit + offsetY]
}

export function getTargetPosition<K extends string, V extends Values<K>>(
	ref: CanvasRef<K, V>,
	{ target: [id, input] }: Edge
): [number, number] {
	const {
		kind,
		position: [x, y],
	} = ref.nodes.get(id)!
	const index = ref.schema[kind].inputs.indexOf(input as string)
	const offsetY = getPortOffsetY(index)
	return [x * ref.unit, y * ref.unit + offsetY]
}

export const getPortOffsetY = (index: number) =>
	index * portHeight + portMargin + portRadius

export const getBackgroundColor = <K extends string, V extends Values<K>>(
	schema: Schema<K, V>
) => ({ kind }: Node<K, V>) =>
	schema[kind].backgroundColor || defaultBackgroundColor

export type Target = {
	x: number
	y: number
	target: Port
}

export const getX = ({ x }: Target) => x
export const getY = ({ y }: Target) => y

export function getTargets<K extends string, V extends Values<K>>(
	ref: CanvasRef<K, V>,
	sourceId: number
) {
	const targets: Target[] = []
	for (const node of ref.nodes.values()) {
		if (node.id === sourceId) {
			continue
		} else {
			const [x, y] = node.position
			const { inputs } = ref.schema[node.kind]
			for (const [index, input] of inputs.entries()) {
				if (node.inputs[input] === null) {
					targets.push({
						target: [node.id, input],
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
): [number, number] => [
	Math.min(X - 1, Math.max(0, Math.round(x / unit))),
	Math.min(Y - 1, Math.max(0, Math.round(y / unit))),
]
