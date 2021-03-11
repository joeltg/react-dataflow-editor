import { D3DragEvent, drag, DragBehavior } from "d3-drag"
import { Quadtree } from "d3-quadtree"
import { BaseType, Selection } from "d3-selection"

import * as actions from "./redux/actions.js"
import { CanvasRef, forInputs, Node, Schema, Target } from "./interfaces.js"
import { startPreview, stopPreview, updatePreview } from "./preview.js"
import {
	getPortOffsetY,
	getSourcePosition,
	getTargetPosition,
	getTargets,
	portRadius,
	DropTarget,
} from "./utils.js"
import { defaultBackgroundColor, defaultBorderColor } from "./styles.js"

export type Input<S extends Schema> = {
	index: number
	target: Target<S, keyof S>
	value: string
}

type InputDragSubject<S extends Schema> = {
	x: number
	y: number
	sourcePosition: [number, number]
	targets: Quadtree<DropTarget<S>>
	edge: Selection<SVGGElement, unknown, null, undefined>
}

type InputDragEvent<S extends Schema> = D3DragEvent<
	SVGCircleElement,
	Input<S>,
	InputDragSubject<S>
>

const inputDragBehavior = <S extends Schema>(
	ref: CanvasRef<S>
): DragBehavior<SVGCircleElement, Input<S>, InputDragSubject<S>> =>
	drag<SVGCircleElement, Input<S>>()
		.on("start", function onStart(event: InputDragEvent<S>) {
			this.classList.add("hidden")
			event.subject.edge.classed("hidden", true)
			const sourcePosition = event.subject.sourcePosition
			const targetPosition = [event.subject.x, event.subject.y]
			ref.preview.call(startPreview, sourcePosition, targetPosition)
		})
		.on("drag", function onDrag(event: InputDragEvent<S>) {
			const { targets, sourcePosition } = event.subject
			const result = targets.find(event.x, event.y, 2 * portRadius)
			if (result !== undefined) {
				const targetPosition = [result.x, result.y]
				ref.preview.call(updatePreview, sourcePosition, targetPosition, true)
			} else {
				const targetPosition = [event.x, event.y]
				ref.preview.call(updatePreview, sourcePosition, targetPosition, false)
			}
		})
		.on(
			"end",
			function onEnd(
				{ x, y, subject: { targets, edge } }: InputDragEvent<S>,
				{ value, target: { id: fromId, input: fromInput } }: Input<S>
			) {
				this.classList.remove("hidden")
				edge.classed("hidden", false)
				ref.preview.call(stopPreview, false)
				const result = targets.find(x, y, 2 * portRadius)
				if (result !== undefined) {
					const { target } = result
					const { id: toId, input: toInput } = target
					if (fromId !== toId || fromInput !== toInput) {
						ref.dispatch(actions.moveEdge(value, target))
					}
				} else {
					ref.dispatch(actions.deleteEdge(value))
				}
			}
		)
		.subject(function (
			{}: InputDragSubject<S>,
			{ target: { id: targetId, input }, value }: Input<S>
		): InputDragSubject<S> {
			const { source, target } = ref.graph.edges[value]

			const sourcePosition = getSourcePosition(ref, source)
			const [x, y] = getTargetPosition(ref, target)

			const targets = getTargets(ref, source.id)
			targets.add({ x, y, target: { id: targetId, input } })

			const edge = ref.edges.select<SVGGElement>(`g.edge[data-id="${value}"]`)

			return { targets, x, y, sourcePosition, edge }
		}) as any

const getInputKey = <S extends Schema>({
	target: { input },
}: Input<S>): string => input

export const updateInputPorts = <S extends Schema>(ref: CanvasRef<S>) => (
	inputs: Selection<SVGCircleElement, Input<S>, BaseType, Node<S>>
) => {
	const dragBehavior = inputDragBehavior(ref)
	return inputs
		.data<Input<S>>((node: Node<S>): Input<S>[] => {
			const inputs: Input<S>[] = []
			for (const [index, input] of forInputs(ref.blocks, node.kind)) {
				const value: null | string = node.inputs[input]
				if (value !== null) {
					inputs.push({ index, target: { id: node.id, input }, value })
				}
			}

			return inputs
		}, getInputKey)
		.join((enter) => {
			const circles = enter
				.append("circle")
				.classed("port", true)
				.attr("cx", 0)
				.attr("cy", ({ index }) => getPortOffsetY(index))
				.attr("r", portRadius)
				.attr("fill", defaultBackgroundColor)
				.attr("stroke", defaultBorderColor)
				.call(dragBehavior)
			circles.append("title").text(getInputKey).datum(null)
			return circles
		})
}
