import { select, Selection } from "d3-selection"
import { D3DragEvent, drag, DragBehavior } from "d3-drag"

import type { Kinds, Position, Schema } from "./state.js"
import {
	getEdgeSource,
	getEdgeTarget,
	getInputOffset,
	getNodeAttributes,
	getOutputOffset,
	getSourcePosition,
	getTargetPosition,
	makeCurvePath,
	place,
	snap,
	toTranslate,
} from "./utils.js"
import { CanvasContext } from "./context.js"

import { EditorAction, moveNode } from "./actions.js"

type IncomingEdge = {
	sourcePosition: [number, number]
	inputOffset: [number, number]
}

type OutgoingEdge = {
	targetPosition: [number, number]
	outputOffset: [number, number]
}

export type NodeDragSubject = {
	x: number
	y: number
	id: string
	incoming: Selection<SVGGElement, IncomingEdge, SVGGElement | null, undefined>
	outgoing: Selection<SVGGElement, OutgoingEdge, SVGGElement | null, undefined>
	position: Position
}

type NodeDragEvent = D3DragEvent<SVGGElement, undefined, NodeDragSubject>

export function makeNodeDragBehavior<S extends Schema>(
	context: CanvasContext,
	kinds: Kinds<S>,
	dispatch: (action: EditorAction<S>) => void
): DragBehavior<SVGGElement, undefined, NodeDragSubject> {
	// The binding element here is a g.node
	return drag<SVGGElement, undefined, NodeDragSubject>()
		.on("start", function onStart(event: NodeDragEvent) {
			this.setAttribute("cursor", "grabbing")
			context.onFocus({ element: "node", id: event.subject.id })
		})
		.on("drag", function onDrag(event: NodeDragEvent) {
			const { x, y, subject } = event
			setNodePosition.call(this, subject, [x, y])
		})
		.on("end", function onEnd(event: NodeDragEvent) {
			this.setAttribute("cursor", "grab")

			const position = snap(context, [event.x, event.y])
			if (
				position.x !== event.subject.position.x ||
				position.y !== event.subject.position.y
			) {
				dispatch(moveNode(event.subject.id, position))
			} else {
				setNodePosition.call(this, event.subject, [
					event.subject.x,
					event.subject.y,
				])
			}
		})
		.subject(function getSubject(event: NodeDragEvent): NodeDragSubject {
			const node = select(this)
			const { id, position } = getNodeAttributes(node)
			const [x, y] = place(context, position)

			const edges = select<SVGGElement | null, undefined>(
				context.edgesRef.current
			)

			const incoming = edges
				.selectAll<SVGGElement, unknown>(`g[data-target-id="${id}"]`)
				.datum<IncomingEdge>(function () {
					const edge = select(this)
					const source = getEdgeSource(edge)
					const { kind, input } = getEdgeTarget(edge)
					return {
						sourcePosition: getSourcePosition(context, kinds, source),
						inputOffset: getInputOffset(kinds, kind, input),
					}
				})

			const outgoing = edges
				.selectAll<SVGGElement, unknown>(`g[data-source-id="${id}"]`)
				.datum<OutgoingEdge>(function () {
					const edge = select(this)
					const { kind, output } = getEdgeSource(edge)
					const target = getEdgeTarget(edge)
					return {
						outputOffset: getOutputOffset(kinds, kind, output),
						targetPosition: getTargetPosition(context, kinds, target),
					}
				})

			return { x, y, id, incoming, outgoing, position }
		})
}

function setEdgePosition(
	this: SVGGElement,
	sourcePosition: [number, number],
	targetPosition: [number, number]
) {
	const d = makeCurvePath(sourcePosition, targetPosition)
	for (const path of this.querySelectorAll("path")) {
		path.setAttribute("d", d)
	}
}

function setNodePosition(
	this: SVGGElement,
	subject: NodeDragSubject,
	[x, y]: [number, number]
) {
	this.setAttribute("transform", toTranslate([x, y]))

	subject.incoming.each(function ({ sourcePosition, inputOffset: [dx, dy] }) {
		setEdgePosition.call(this, sourcePosition, [x + dx, y + dy])
	})

	subject.outgoing.each(function ({ outputOffset: [dx, dy], targetPosition }) {
		setEdgePosition.call(this, [x + dx, y + dy], targetPosition)
	})
}
