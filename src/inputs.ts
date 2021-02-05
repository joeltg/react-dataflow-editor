import { D3DragEvent, drag, DragBehavior } from "d3-drag"
import { Quadtree } from "d3-quadtree"
import { BaseType, Selection } from "d3-selection"

import * as actions from "./redux/actions.js"
import { CanvasRef, forInputs, Node, Schema, Target } from "./interfaces.js"
import { startPreview, stopPreview, updatePreview } from "./preview.js"
import {
	defaultBackgroundColor,
	defaultBorderColor,
	getPortOffsetY,
	getSourcePosition,
	getTargetPosition,
	getTargets,
	portRadius,
	DropTarget,
} from "./utils.js"

export type Input<S extends Schema> = {
	index: number
	target: Target<S, keyof S>
	value: number
}

type InputDragSubject<S extends Schema> = {
	x: number
	y: number
	sourcePosition: [number, number]
	targets: Quadtree<DropTarget<S>>
	preview: Selection<SVGGElement, unknown, null, undefined>
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
			event.subject.preview.call(startPreview, event.subject.sourcePosition, [
				event.subject.x,
				event.subject.y,
			])
		})
		.on("drag", function onDrag(event: InputDragEvent<S>) {
			const { targets, sourcePosition, preview } = event.subject
			const result = targets.find(event.x, event.y, 2 * portRadius)
			if (result !== undefined) {
				const targetPosition = [result.x, result.y]
				preview.call(updatePreview, sourcePosition, targetPosition, true)
			} else {
				const targetPosition = [event.x, event.y]
				preview.call(updatePreview, sourcePosition, targetPosition, false)
			}
		})
		.on(
			"end",
			function onEnd(
				{ x, y, subject: { targets, preview, edge } }: InputDragEvent<S>,
				{ value, target: [fromId, fromInput] }: Input<S>
			) {
				this.classList.remove("hidden")
				edge.classed("hidden", false)
				preview.call(stopPreview, false)
				const result = targets.find(x, y, 2 * portRadius)
				if (result !== undefined) {
					const { target } = result
					const [toId, toInput] = target
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
			{ target: [targetId, input], value }: Input<S>
		): InputDragSubject<S> {
			const e = ref.edges.get(value)!

			const sourcePosition = getSourcePosition(ref, e)
			const [x, y] = getTargetPosition(ref, e)

			const [sourceId] = e.source
			const targets = getTargets(ref, sourceId)
			targets.add({ x, y, target: [targetId, input] })

			const preview = ref.svg.select<SVGGElement>("g.preview")
			const edge = ref.svg.select<SVGGElement>(
				`g.edges > g.edge[data-id="${value}"]`
			)

			return { targets, x, y, sourcePosition, preview, edge }
		}) as any

const getInputKey = <S extends Schema>({
	target: [_, input],
}: Input<S>): string => input

export const updateInputPorts = <S extends Schema>(ref: CanvasRef<S>) => (
	inputs: Selection<SVGCircleElement, Input<S>, BaseType, Node<S>>
) => {
	const dragBehavior = inputDragBehavior(ref)
	return inputs
		.data<Input<S>>((node: Node<S>): Input<S>[] => {
			const inputs: Input<S>[] = []
			for (const [index, input] of forInputs(ref.blocks, node.kind)) {
				const value: null | number = node.inputs[input]
				if (value !== null) {
					inputs.push({ index, target: [node.id, input], value })
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
