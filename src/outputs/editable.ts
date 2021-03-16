import { D3DragEvent, drag, DragBehavior } from "d3-drag"
import { Quadtree } from "d3-quadtree"

import { CanvasRef, Schema } from "../interfaces.js"
import { startPreview, stopPreview, updatePreview } from "../preview.js"
import * as actions from "../redux/actions.js"
import {
	getPortOffsetY,
	portRadius,
	blockWidth,
	AttachPorts,
} from "../utils.js"

import { getTargets, DropTarget } from "../target.js"

import { appendOutputPorts, getOutputKey, getOutputs, Output } from "./index.js"

type OutputDragSubject<S extends Schema> = {
	x: number
	y: number
	targets: Quadtree<DropTarget<S>>
}

type OutputDragEvent<S extends Schema> = D3DragEvent<
	SVGCircleElement,
	Output<S>,
	OutputDragSubject<S>
>

const outputDragBehavior = <S extends Schema>(
	ref: CanvasRef<S>
): DragBehavior<SVGCircleElement, Output<S>, OutputDragSubject<S>> =>
	drag<SVGCircleElement, Output<S>>()
		.on("start", function onStart(event: OutputDragEvent<S>) {
			this.classList.add("dragging")
			const { x, y } = event.subject
			ref.preview.call(startPreview, [x, y], [x, y])
		})
		.on("drag", function onDrag(event: OutputDragEvent<S>) {
			const { x, y, targets } = event.subject
			const source = [x, y]
			const result = targets.find(event.x, event.y, 2 * portRadius)
			const target =
				result !== undefined ? [result.x, result.y] : [event.x, event.y]
			ref.preview.call(updatePreview, source, target, result !== undefined)
		})
		.on(
			"end",
			function onEnd(event: OutputDragEvent<S>, { source }: Output<S>) {
				this.classList.remove("dragging")
				const { targets } = event.subject
				ref.preview.call(stopPreview, false)
				const result = targets.find(event.x, event.y, 2 * portRadius)
				if (result !== undefined) {
					const { target } = result
					ref.dispatch(actions.createEdge(source, target))
				}
			}
		)
		.subject(function (
			event: OutputDragEvent<S>,
			{ index, source: { id } }: Output<S>
		): OutputDragSubject<S> {
			const {
				position: { x, y },
			} = ref.graph.nodes[id]

			return {
				targets: getTargets(ref, id),
				x: x * ref.unit + blockWidth,
				y: y * ref.unit + getPortOffsetY(index),
			}
		}) as any

export function updateOutputPorts<S extends Schema>(
	ref: CanvasRef<S>
): AttachPorts<S> {
	const dragBehavior = outputDragBehavior(ref)
	return (outputs) =>
		outputs
			.selectAll<SVGCircleElement, Output<S>>("circle.port")
			.data((node) => getOutputs(ref, node), getOutputKey)
			.join((enter) => appendOutputPorts(enter).call(dragBehavior))
}
