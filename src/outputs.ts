import { D3DragEvent, drag, DragBehavior } from "d3-drag"
import { Quadtree } from "d3-quadtree"
import { BaseType, Selection } from "d3-selection"

import { CanvasRef, GetOutputs, Node, Schema, Source } from "./interfaces.js"
import { startPreview, stopPreview, updatePreview } from "./preview.js"
import * as actions from "./redux/actions.js"
import {
	defaultBackgroundColor,
	defaultBorderColor,
	getPortOffsetY,
	getTargets,
	portRadius,
	DropTarget,
} from "./utils.js"

export type Output<S extends Schema> = {
	index: number
	source: Source<S, keyof S>
	value: Set<number>
}

type OutputDragSubject<S extends Schema> = {
	x: number
	y: number
	targets: Quadtree<DropTarget<S>>
	preview: Selection<SVGGElement, unknown, null, undefined>
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
			const { x, y, preview } = event.subject
			preview.call(startPreview, [x, y], [x, y])
		})
		.on("drag", function onDrag(event: OutputDragEvent<S>) {
			const { x, y, targets, preview } = event.subject
			const source = [x, y]
			const result = targets.find(event.x, event.y, 2 * portRadius)
			const target =
				result !== undefined ? [result.x, result.y] : [event.x, event.y]
			preview.call(updatePreview, source, target, result !== undefined)
		})
		.on(
			"end",
			function onEnd(event: OutputDragEvent<S>, { source }: Output<S>) {
				this.classList.remove("dragging")
				const { targets, preview } = event.subject
				preview.call(stopPreview, false)
				const result = targets.find(event.x, event.y, 2 * portRadius)
				if (result !== undefined) {
					const { target } = result
					ref.dispatch(actions.createEdge(source, target))
				}
			}
		)
		.subject(function (
			event: OutputDragEvent<S>,
			{ index, source: [id] }: Output<S>
		): OutputDragSubject<S> {
			const {
				position: [x, y],
			} = ref.nodes.get(id)!

			const [width] = ref.contentDimensions.get(id)!
			const offsetX = width + 2 * portRadius

			const preview = ref.svg.select<SVGGElement>("g.preview")

			return {
				targets: getTargets(ref, id),
				x: x * ref.unit + offsetX,
				y: y * ref.unit + getPortOffsetY(index),
				preview,
			}
		}) as any

const getOutputKey = <S extends Schema>({
	source: [_, output],
}: Output<S>): string => output

export const updateOutputPorts = <S extends Schema>(ref: CanvasRef<S>) => (
	outputs: Selection<SVGCircleElement, Output<S>, BaseType, Node<S>>
) => {
	const dragBehavior = outputDragBehavior(ref)
	return outputs
		.data<Output<S>>(
			({ kind, id, outputs }: Node<S>): Output<S>[] =>
				ref.blocks[kind].outputs.map(
					(output: GetOutputs<S, keyof S>[number], index) => ({
						index,
						source: [id, output],
						value: outputs[output],
					})
				),
			getOutputKey
		)
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
			circles.append("title").text(getOutputKey).datum(null)
			return circles
		})
}
