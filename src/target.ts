import { quadtree } from "d3-quadtree"
import { select } from "d3-selection"

import type { Kinds, Schema, Target } from "./state.js"
import type { CanvasContext } from "./context.js"
import { getInputOffset, getNodeAttributes, place } from "./utils.js"

export type DragTarget<S extends Schema> = {
	x: number
	y: number
	target: Target<S>
}

export function getTargets<S extends Schema>(
	context: CanvasContext,
	kinds: Kinds<S>,
	target?: Target<S>
) {
	const targets: DragTarget<S>[] = []

	const nodes = select(context.nodesRef.current)
	for (const nodeElement of nodes.selectAll<SVGGElement, unknown>("g.node")) {
		const node = select(nodeElement)
		const { id, kind, position } = getNodeAttributes(node)
		const ports = node.selectAll<SVGGElement, undefined>("g.input")
		for (const portElement of ports) {
			const port = select(portElement)
			const input = port.attr("data-input")
			const hasValue = portElement.hasAttribute("data-value")
			const isCurrentTarget =
				target !== undefined && target.id === id && target.input === input
			if (!hasValue || isCurrentTarget) {
				const offset = getInputOffset(kinds, kind, input)
				const [x, y] = place(context, position, offset)
				targets.push({ target: { id, input }, x, y })
			}
		}
	}

	return quadtree(targets, getX, getY)
}

export const getX = <S extends Schema>({ x }: DragTarget<S>) => x
export const getY = <S extends Schema>({ y }: DragTarget<S>) => y
