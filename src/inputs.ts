import { D3DragEvent, drag, DragBehavior } from "d3-drag"
import { Quadtree } from "d3-quadtree"
import { BaseType, Selection } from "d3-selection"

import * as actions from "./redux/actions.js"
import { CanvasRef, Node, Port, Values } from "./interfaces.js"
import { startPreview, stopPreview, updatePreview } from "./preview.js"
import {
	defaultBackgroundColor,
	defaultBorderColor,
	getPortOffsetY,
	getSourcePosition,
	getTargetPosition,
	getTargets,
	portRadius,
	Target,
} from "./utils.js"

export type Input = {
	index: number
	target: Port
	value: number
}

type InputDragSubject = {
	x: number
	y: number
	sourcePosition: [number, number]
	targets: Quadtree<Target>
	preview: Selection<SVGGElement, unknown, null, undefined>
	edge: Selection<SVGGElement, unknown, null, undefined>
}

type InputDragEvent = D3DragEvent<SVGCircleElement, Input, InputDragSubject>

const inputDragBehavior = <K extends string, V extends Values<K>>(
	ref: CanvasRef<K, V>
): DragBehavior<SVGCircleElement, Input, InputDragSubject> =>
	drag<SVGCircleElement, Input>()
		.on("start", function onStart(event: InputDragEvent) {
			this.classList.add("hidden")
			event.subject.edge.classed("hidden", true)
			event.subject.preview.call(startPreview, event.subject.sourcePosition, [
				event.subject.x,
				event.subject.y,
			])
		})
		.on("drag", function onDrag(event: InputDragEvent) {
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
				{ x, y, subject: { targets, preview, edge } }: InputDragEvent,
				{ value, target: [fromId, fromInput] }: Input
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
			{}: InputDragSubject,
			{ target: [targetId, input], value }: Input
		): InputDragSubject {
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

const getInputKey = ({ target: [_, input] }: Input) => input as string

export const updateInputPorts = <K extends string, V extends Values<K>>(
	ref: CanvasRef<K, V>
) => (inputs: Selection<SVGCircleElement, Input, BaseType, Node<K, V>>) => {
	const dragBehavior = inputDragBehavior(ref)
	return inputs
		.data<Input>((node: Node<K, V>): Input[] => {
			const inputs: Input[] = []
			for (const [index, input] of ref.schema[node.kind].inputs.entries()) {
				const value = node.inputs[input]
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
