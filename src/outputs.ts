import { D3DragEvent, drag, DragBehavior } from "d3-drag"
import { Quadtree } from "d3-quadtree"
import { BaseType, Selection } from "d3-selection"

import { CanvasRef, Node, Port, Values } from "./interfaces.js"
import { startPreview, stopPreview, updatePreview } from "./preview.js"
import * as actions from "./redux/actions.js"
import {
	defaultBackgroundColor,
	defaultBorderColor,
	getPortOffsetY,
	getTargets,
	portRadius,
	Target,
} from "./utils.js"

export type Output = {
	index: number
	source: Port
	value: Set<number>
}

type OutputDragSubject = {
	x: number
	y: number
	targets: Quadtree<Target>
	preview: Selection<SVGGElement, unknown, null, undefined>
}

type OutputDragEvent = D3DragEvent<SVGCircleElement, Output, OutputDragSubject>

const outputDragBehavior = <K extends string, V extends Values<K>>(
	ref: CanvasRef<K, V>
): DragBehavior<SVGCircleElement, Output, OutputDragSubject> =>
	drag<SVGCircleElement, Output>()
		.on("start", function onStart(event: OutputDragEvent) {
			this.classList.add("dragging")
			const { x, y, preview } = event.subject
			preview.call(startPreview, [x, y], [x, y])
		})
		.on("drag", function onDrag(event: OutputDragEvent) {
			const { x, y, targets, preview } = event.subject
			const source = [x, y]
			const result = targets.find(event.x, event.y, 2 * portRadius)
			const target =
				result !== undefined ? [result.x, result.y] : [event.x, event.y]
			preview.call(updatePreview, source, target, result !== undefined)
		})
		.on("end", function onEnd(event: OutputDragEvent, { source }: Output) {
			this.classList.remove("dragging")
			const { targets, preview } = event.subject
			preview.call(stopPreview, false)
			const result = targets.find(event.x, event.y, 2 * portRadius)
			if (result !== undefined) {
				const { target } = result
				ref.dispatch(actions.createEdge(source, target))
			}
		})
		.subject(function (
			event: OutputDragEvent,
			{ index, source: [id] }: Output
		): OutputDragSubject {
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

const getOutputKey = ({ source: [_, output] }: Output) => output as string

export const updateOutputPorts = <K extends string, V extends Values<K>>(
	ref: CanvasRef<K, V>
) => (outputs: Selection<SVGCircleElement, Output, BaseType, Node<K, V>>) => {
	const dragBehavior = outputDragBehavior(ref)
	return outputs
		.data<Output>(
			({ kind, id, outputs }: Node<K, V>): Output[] =>
				ref.schema[kind].outputs.map((output, index) => ({
					index,
					source: [id, output],
					value: outputs[output],
				})),
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
