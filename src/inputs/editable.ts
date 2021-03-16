import { D3DragEvent, drag, DragBehavior } from "d3-drag"
import { Quadtree } from "d3-quadtree"
import { Selection } from "d3-selection"

import * as actions from "../redux/actions.js"
import { CanvasRef, Schema } from "../interfaces.js"
import { startPreview, stopPreview, updatePreview } from "../preview.js"
import {
	getSourcePosition,
	getTargetPosition,
	portRadius,
	AttachPorts,
} from "../utils.js"

import { getTargets, DropTarget } from "../target.js"

import { Input, appendInputPorts, getInputKey, getInputs } from "./index.js"

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
		.on("start", function onStart(event: InputDragEvent<S>, input) {
			if (input.value !== null) {
				this.classList.add("hidden")
				event.subject.edge.classed("hidden", true)
				const sourcePosition = event.subject.sourcePosition
				const targetPosition = [event.subject.x, event.subject.y]
				ref.preview.call(startPreview, sourcePosition, targetPosition)
			}
		})
		.on("drag", function onDrag(event: InputDragEvent<S>, input) {
			if (input.value !== null) {
				const { targets, sourcePosition } = event.subject
				const result = targets.find(event.x, event.y, 2 * portRadius)
				if (result !== undefined) {
					const targetPosition = [result.x, result.y]
					ref.preview.call(updatePreview, sourcePosition, targetPosition, true)
				} else {
					const targetPosition = [event.x, event.y]
					ref.preview.call(updatePreview, sourcePosition, targetPosition, false)
				}
			}
		})
		.on(
			"end",
			function onEnd(
				{ x, y, subject: { targets, edge } }: InputDragEvent<S>,
				{ value, target: { id: fromId, input: fromInput } }: Input<S>
			) {
				if (value !== null) {
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
			}
		)
		.subject(function ({}: InputDragSubject<S>, input: Input<S>) {
			if (input.value == null) {
				return input
			}

			const { source, target } = ref.graph.edges[input.value]

			const sourcePosition = getSourcePosition(ref, source)
			const [x, y] = getTargetPosition(ref, target)

			const targets = getTargets(ref, source.id)
			targets.add({
				x,
				y,
				target: {
					id: input.target.id,
					input: input.target.input,
				},
			})

			const edge = ref.edges.select<SVGGElement>(
				`g.edge[data-id="${input.value}"]`
			)

			return { targets, x, y, sourcePosition, edge }
		}) as any

export function updateInputPorts<S extends Schema>(
	ref: CanvasRef<S>
): AttachPorts<S> {
	const dragBehavior = inputDragBehavior(ref)
	return (inputs) => {
		inputs
			.selectAll<SVGCircleElement, Input<S>>("circle.port")
			.data((node) => getInputs(ref, node), getInputKey)
			.join(
				(enter) => appendInputPorts(enter).call(dragBehavior),
				(update) =>
					update
						.classed("hidden", ({ value }) => value === null)
						.attr("data-value", ({ value }) => value)
			)
	}
}
