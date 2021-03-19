import { Selection } from "d3-selection"
import { D3DragEvent, drag } from "d3-drag"

import { updateInputPorts } from "../inputs/editable.js"

import * as actions from "../redux/actions.js"
import { CanvasRef, Edge, Node, Position, Schema } from "../interfaces.js"

import { updateOutputPorts } from "../outputs/editable.js"

import {
	getKey,
	getPortOffsetY,
	getSourcePosition,
	getTargetPosition,
	toTranslate,
	snap,
	blockWidth,
	getTargetIndex,
	getSourceIndex,
} from "../utils.js"

import { appendNodes } from "./index.js"
import { setEdgePosition } from "../edges.js"

type BlockDragSubject<S extends Schema> = {
	x: number
	y: number
	incoming: Selection<SVGGElement, Edge<S>, SVGGElement | null, unknown>
	outgoing: Selection<SVGGElement, Edge<S>, SVGGElement | null, unknown>
}

type BlockDragEvent<S extends Schema> = D3DragEvent<
	SVGForeignObjectElement,
	Node<S>,
	BlockDragSubject<S>
>

const nodeDragBehavior = <S extends Schema>(ref: CanvasRef<S>) => {
	function setNodePosition(
		this: SVGGElement,
		subject: BlockDragSubject<S>,
		{ x, y }: Position
	) {
		this.setAttribute("transform", toTranslate(x, y))

		const x2 = x

		subject.incoming.each(function ({ source, target }) {
			const sourcePosition = getSourcePosition(ref, source)
			const targetIndex = getTargetIndex(ref, target)
			const y2 = y + getPortOffsetY(targetIndex)
			setEdgePosition.call(this, sourcePosition, [x2, y2])
		})

		const x1 = x + blockWidth
		subject.outgoing.each(function ({ source, target }) {
			const sourceIndex = getSourceIndex(ref, source)
			const y1 = y + getPortOffsetY(sourceIndex)
			const targetPosition = getTargetPosition(ref, target)
			setEdgePosition.call(this, [x1, y1], targetPosition)
		})
	}

	return drag<SVGGElement, Node<S>>()
		.on("start", function onStart(event: BlockDragEvent<S>, node: Node<S>) {
			this.style.cursor = "grabbing"
		})
		.on("drag", function onDrag(event: BlockDragEvent<S>, node: Node<S>) {
			const { x, y, subject } = event
			setNodePosition.call(this, subject, { x, y })
		})
		.on("end", function onEnd(event: BlockDragEvent<S>, node: Node<S>) {
			this.style.cursor = "grab"
			const snapped = snap(ref, [event.x, event.y])
			if (snapped.x === node.position.x && snapped.y === node.position.y) {
				const position = { x: snapped.x * ref.unit, y: snapped.y * ref.unit }
				setNodePosition.call(this, event.subject, position)
			} else {
				ref.dispatch(actions.moveNode(node.id, snapped))
			}
		})
		.subject(function (
			event: BlockDragEvent<S>,
			node: Node<S>
		): BlockDragSubject<S> {
			const { x, y } = node.position
			const incoming = ref.edges.selectAll<SVGGElement, Edge<S>>(
				`g.edge[data-target="${node.id}"]`
			)
			const outgoing = ref.edges.selectAll<SVGGElement, Edge<S>>(
				`g.edge[data-source="${node.id}"]`
			)
			return { x: ref.unit * x, y: ref.unit * y, incoming, outgoing }
		})
}

const nodeKeyDownBehavior = <S extends Schema>(ref: CanvasRef<S>) =>
	function keydown(this: SVGGElement, event: KeyboardEvent, node: Node<S>) {
		if (event.key === "ArrowDown") {
			event.preventDefault()
			const { x, y } = node.position
			if (y < ref.height - 1) {
				ref.dispatch(actions.moveNode(node.id, { x, y: y + 1 }))
			}
		} else if (event.key === "ArrowUp") {
			event.preventDefault()
			const { x, y } = node.position
			if (y > 0) {
				ref.dispatch(actions.moveNode(node.id, { x, y: y - 1 }))
			}
		} else if (event.key === "ArrowRight") {
			event.preventDefault()
			const { x, y } = node.position
			ref.dispatch(actions.moveNode(node.id, { x: x + 1, y }))
		} else if (event.key === "ArrowLeft") {
			event.preventDefault()
			const { x, y } = node.position
			if (x > 0) {
				ref.dispatch(actions.moveNode(node.id, { x: x - 1, y }))
			}
		} else if (event.key === "Backspace") {
			event.preventDefault()
			ref.dispatch(actions.deleteNode(node.id))
		}
	}

export const updateNodes = <S extends Schema>(ref: CanvasRef<S>) => {
	const nodeDrag = nodeDragBehavior(ref)
	const nodeKeyDown = nodeKeyDownBehavior(ref)

	const updateInputs = updateInputPorts(ref)
	const updateOutputs = updateOutputPorts(ref)

	function focused(this: SVGGElement, event: FocusEvent, node: Node<S>) {
		if (ref.onFocus !== undefined) {
			ref.onFocus(node.id)
		}
	}

	function blurred(this: SVGGElement, event: FocusEvent, node: Node<S>) {
		if (ref.onFocus !== undefined) {
			ref.onFocus(null)
		}
	}

	const decorateNodes = ref.decorateNodes || ((node) => {})

	return () => {
		ref.nodes
			.selectAll<SVGGElement, Node<S>>("g.node")
			.data<Node<S>>(Object.values(ref.graph.nodes), getKey)
			.join(
				(enter) =>
					appendNodes(ref, enter, updateInputs, updateOutputs)
						.style("cursor", "grab")
						.on("focus", focused)
						.on("blur", blurred)
						.on("keydown", nodeKeyDown)
						.call(nodeDrag)
						.call(decorateNodes),
				(update) => {
					update.attr("transform", ({ position: { x, y } }) =>
						toTranslate(x * ref.unit, y * ref.unit)
					)

					update.select<SVGGElement>("g.inputs").call(updateInputs)

					update.call(decorateNodes)

					return update
				},
				(exit) => exit.remove()
			)
	}
}
