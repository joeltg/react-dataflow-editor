import { quadtree } from "d3-quadtree"

import { ReadonlyCanvasRef, Schema, Target } from "./interfaces.js"
import { forInputs, getPortOffsetY } from "./utils.js"

export function getTargets<S extends Schema>(
	ref: ReadonlyCanvasRef<S>,
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

export type DropTarget<S extends Schema> = {
	x: number
	y: number
	target: Target<S, keyof S>
}

export const getX = <S extends Schema>({ x }: DropTarget<S>) => x
export const getY = <S extends Schema>({ y }: DropTarget<S>) => y
