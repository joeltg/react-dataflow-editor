import { select, Selection } from "d3-selection"
import { D3DragEvent, DragBehavior, drag } from "d3-drag"
import { Quadtree } from "d3-quadtree"

import type { Schema, Source, Kinds } from "./state.js"

import { getSourcePosition, makeCurvePath, portRadius } from "./utils.js"
import { CanvasContext } from "./context.js"
import { DragTarget, getTargets } from "./target.js"
import { createEdge, EditorAction } from "./actions.js"

export type OutputDragSubject<S extends Schema> = {
	x: number
	y: number
	targets: Quadtree<DragTarget<S>>
	source: Source<S>
	preview: Selection<SVGGElement | null, unknown, null, undefined>
}

type OutputDragEvent<S extends Schema> = D3DragEvent<
	SVGCircleElement,
	unknown,
	OutputDragSubject<S>
>

export function makeOutputDragBehavior<S extends Schema>(
	context: CanvasContext,
	kinds: Kinds<S>,
	dispatch: (action: EditorAction<S>) => void
): DragBehavior<SVGCircleElement, unknown, OutputDragSubject<S>> {
	// The binding element here is a g.output > circle
	return drag<SVGCircleElement, unknown, OutputDragSubject<S>>()
		.on("start", function onStart(event: OutputDragEvent<S>) {
			event.subject.preview.attr("display", null)
			event.subject.preview
				.selectAll("circle")
				.attr("cx", event.x)
				.attr("cy", event.y)
		})
		.on("drag", function onDrag(event: OutputDragEvent<S>) {
			const result = event.subject.targets.find(
				event.x,
				event.y,
				portRadius * 2
			)

			const [x, y] =
				result !== undefined ? [result.x, result.y] : [event.x, event.y]

			event.subject.preview.select("circle.target").attr("cx", x).attr("cy", y)
			const path = makeCurvePath([event.subject.x, event.subject.y], [x, y])
			event.subject.preview.select("path").attr("d", path)
		})
		.on("end", function onEnd(event: OutputDragEvent<S>) {
			const result = event.subject.targets.find(
				event.x,
				event.y,
				2 * portRadius
			)

			if (result !== undefined) {
				const { target } = result
				dispatch(createEdge(event.subject.source, target))
			}

			event.subject.preview.attr("display", "none")
			event.subject.preview
				.selectAll("circle")
				.attr("cx", null)
				.attr("cy", null)
			event.subject.preview.select("path").attr("d", null)
		})

		.subject(function (event: OutputDragEvent<S>): OutputDragSubject<S> {
			const targets = getTargets<S>(context, kinds)

			const port = select(this.parentElement)
			const id = port.attr("data-id")
			const output = port.attr("data-output")

			const source = { id, output }
			const [x, y] = getSourcePosition(context, kinds, source)

			const preview = select(context.previewRef.current)

			return { x, y, targets, source, preview }
		})
}
