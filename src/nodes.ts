import { D3DragEvent, drag } from "d3-drag"
import { Selection } from "d3-selection"
import { Input, updateInputPorts } from "./inputs.js"

import * as actions from "./redux/actions.js"
import { CanvasRef, Edge, Node, Position, Schema } from "./interfaces.js"
import { Output, updateOutputPorts } from "./outputs.js"
import { makeCurvePath } from "./curve.js"
import { defaultBorderColor, getBackgroundColor } from "./styles.js"
import {
	getKey,
	getPortOffsetY,
	getSourcePosition,
	getTargetPosition,
	toTranslate,
	snap,
	blockWidth,
	makeClipPath,
	portHeight,
	getTargetIndex,
	getSourceIndex,
} from "./utils.js"

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

const getFrameTransform = <S extends Schema>(ref: CanvasRef<S>) => ({
	position: { x, y },
}: Node<S>) => toTranslate(x * ref.unit, y * ref.unit)

const nodeDragBehavior = <S extends Schema>(ref: CanvasRef<S>) => {
	function setPosition(
		this: SVGGElement,
		subject: BlockDragSubject<S>,
		{ x, y }: Position
	) {
		this.setAttribute("transform", toTranslate(x, y))

		const x2 = x
		subject.incoming.select("path").attr("d", ({ source, target }) => {
			const sourcePosition = getSourcePosition(ref, source)
			const targetIndex = getTargetIndex(ref, target)
			const y2 = y + getPortOffsetY(targetIndex)
			return makeCurvePath(sourcePosition, [x2, y2])
		})

		const x1 = x + blockWidth
		subject.outgoing.select("path").attr("d", ({ source, target }) => {
			const targetPosition = getTargetPosition(ref, target)
			const sourceIndex = getSourceIndex(ref, source)
			const y1 = y + getPortOffsetY(sourceIndex)
			return makeCurvePath([x1, y1], targetPosition)
		})
	}

	return drag<SVGGElement, Node<S>>()
		.on("start", function onStart(event: BlockDragEvent<S>, node: Node<S>) {
			this.style.cursor = "grabbing"
		})
		.on("drag", function onDrag(event: BlockDragEvent<S>, node: Node<S>) {
			const { x, y, subject } = event
			setPosition.call(this, subject, { x, y })
		})
		.on("end", function onEnd(event: BlockDragEvent<S>, node: Node<S>) {
			this.style.cursor = "grab"
			const snapped = snap([event.x, event.y], ref.unit, ref.dimensions)
			if (snapped.x === node.position.x && snapped.y === node.position.y) {
				const position = { x: snapped.x * ref.unit, y: snapped.y * ref.unit }
				setPosition.call(this, event.subject, position)
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

const nodeClickBehavior = <S extends Schema>(ref: CanvasRef<S>) =>
	function clicked(this: SVGGElement, event: MouseEvent, node: Node<S>) {
		if (event.defaultPrevented) {
			return
		} else {
			// TODO
		}
	}

const nodeKeyDownBehavior = <S extends Schema>(ref: CanvasRef<S>) =>
	function keydown(this: SVGGElement, event: KeyboardEvent, node: Node<S>) {
		if (event.key === "ArrowDown") {
			event.preventDefault()
			const { x, y } = node.position
			const [_, Y] = ref.dimensions
			if (y < Y - 1) {
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
			const [X] = ref.dimensions
			if (x < X - 1) {
				ref.dispatch(actions.moveNode(node.id, { x: x + 1, y }))
			}
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
	const frameTransform = getFrameTransform(ref)

	const nodeDrag = nodeDragBehavior(ref)
	const nodeClick = nodeClickBehavior(ref)
	const nodeKeyDown = nodeKeyDownBehavior(ref)

	const updateInputs = updateInputPorts(ref)
	const updateOutputs = updateOutputPorts(ref)

	return () => {
		ref.nodes
			.selectAll<SVGGElement, Node<S>>("g.node")
			.data<Node<S>>(Object.values(ref.graph.nodes), getKey)
			.join(
				(enter) => {
					const groups = enter
						.append("g")
						.classed("node", true)
						.attr("data-id", getKey)
						.attr("tabindex", 0)
						.call(nodeDrag)
						.on("click", nodeClick)
						.on("keydown", nodeKeyDown)
						.attr("transform", frameTransform)
						.style("cursor", "grab")

					groups
						.append("path")
						.attr("stroke", defaultBorderColor)
						.attr("fill", getBackgroundColor(ref.blocks))
						.attr("stroke-width", 1)
						.attr("d", function ({ kind }) {
							const { inputs, outputs } = ref.blocks[kind]
							const { length: inputCount } = Object.keys(inputs)
							const { length: outputCount } = Object.keys(outputs)

							const w = blockWidth
							const h = Math.max(
								portHeight,
								inputCount * portHeight,
								outputCount * portHeight
							)
							return makeClipPath(inputCount, [w, h])
						})

					groups
						.append("g")
						.classed("inputs", true)
						.selectAll<SVGCircleElement, Input<S>>("circle.port")
						.call(updateInputs)

					groups
						.append("g")
						.classed("outputs", true)
						.attr("transform", toTranslate(blockWidth, 0))
						.selectAll<SVGCircleElement, Output<S>>("circle.port")
						.call(updateOutputs)

					return groups
				},
				(update) => {
					update.attr("transform", frameTransform)

					update
						.select("g.inputs")
						.selectAll<SVGCircleElement, Input<S>>("circle.port")
						.call(updateInputs)

					update
						.select("g.outputs")
						.selectAll<SVGCircleElement, Output<S>>("circle.port")
						.call(updateOutputs)

					return update
				},
				(exit) => exit.remove()
			)
	}
}
