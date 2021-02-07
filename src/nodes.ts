/// <reference types="resize-observer-browser" />

import { D3DragEvent, drag } from "d3-drag"
import { BaseType, select, Selection } from "d3-selection"
import { Input, updateInputPorts } from "./inputs.js"

import * as actions from "./redux/actions.js"
import { CanvasRef, forInputs, forOutputs, Node, Schema } from "./interfaces.js"
import { Output, updateOutputPorts } from "./outputs.js"
import { makeCurvePath } from "./curve.js"
import {
	defaultBorderColor,
	getBackgroundColor,
	getKey,
	getPortOffsetY,
	getSourcePosition,
	getTargetPosition,
	makeClipPath,
	minHeight,
	minWidth,
	portHeight,
	portRadius,
	toTranslate,
	snap,
	positionEqual,
} from "./utils.js"

type BlockDragEvent<S extends Schema> = D3DragEvent<
	SVGForeignObjectElement,
	Node<S>,
	{ x: number; y: number }
>

const handleResize = <S extends Schema>(ref: CanvasRef<S>) => (
	entries: readonly ResizeObserverEntry[]
) => {
	for (const { target, contentRect } of entries) {
		const { width, height } = contentRect

		const foreignObject = target.parentElement!
		foreignObject.setAttribute("width", width.toString())
		foreignObject.setAttribute("height", height.toString())

		const g = select<BaseType, Node<S>>(foreignObject.parentElement)
		const node = g.datum()

		ref.contentDimensions.set(node.id, [width, height])

		const { inputs, outputs } = ref.blocks[node.kind]
		const { length: inputCount } = Object.keys(inputs)
		const { length: outputCount } = Object.keys(outputs)

		const w = Math.max(width, minWidth) + 2 * portRadius
		const h = Math.max(
			height,
			minHeight,
			inputCount * portHeight,
			outputCount * portHeight
		)

		g.select("g.frame > g.outputs").attr("transform", toTranslate(w, 0))
		g.select("g.frame > path").attr("d", makeClipPath(inputCount, [w, h]))

		const [x, y] = node.position
		const x1 = x * ref.unit + width + 2 * portRadius
		for (const [index, output] of forOutputs(ref.blocks, node.kind)) {
			const y1 = y * ref.unit + getPortOffsetY(index)
			for (const id of node.outputs[output]) {
				const targetPosition = getTargetPosition(ref, ref.edges.get(id)!)
				const d = makeCurvePath([x1, y1], targetPosition)
				ref.svg.select(`g.edges > g.edge[data-id="${id}"] > path`).attr("d", d)
			}
		}
	}
}

const getBlockPosition = <S extends Schema>(ref: CanvasRef<S>) => ({
	foreignObjectPositionX: ({ position: [x, y] }: Node<S>) =>
		x * ref.unit + portRadius,
	foreignObjectPositionY: ({ position: [x, y] }: Node<S>) => y * ref.unit,
	frameTransform: ({ position: [x, y] }: Node<S>) =>
		toTranslate(x * ref.unit, y * ref.unit),
})

function setNodePosition<S extends Schema>(
	ref: CanvasRef<S>,
	g: Selection<SVGGElement, unknown, null, undefined>,
	[x, y]: [number, number],
	node: Node<S>
) {
	g.select("g.node > foreignObject")
		.attr("x", x + portRadius)
		.attr("y", y)

	g.select("g.node > g.frame").attr("transform", toTranslate(x, y))

	const edges = ref.svg.select("svg > g.edges")
	for (const [index, input] of forInputs(ref.blocks, node.kind)) {
		const id: null | number = node.inputs[input]
		if (id !== null) {
			const sourcePosition = getSourcePosition(ref, ref.edges.get(id)!)
			const d = makeCurvePath(sourcePosition, [x, y + getPortOffsetY(index)])
			edges.select(`g.edge[data-id="${id}"] > path`).attr("d", d)
		}
	}

	const [offsetX] = ref.contentDimensions.get(node.id)!
	const { outputs } = ref.blocks[node.kind]
	for (const [index, output] of forOutputs(ref.blocks, node.kind)) {
		const x1 = x + offsetX + 2 * portRadius
		const y1 = y + getPortOffsetY(index)
		for (const id of node.outputs[output]) {
			const targetPosition = getTargetPosition(ref, ref.edges.get(id)!)
			const d = makeCurvePath([x1, y1], targetPosition)
			edges.select(`g.edge[data-id="${id}"] > path`).attr("d", d)
		}
	}
}

const nodeDragBehavior = <S extends Schema>(ref: CanvasRef<S>) =>
	drag<SVGGElement, Node<S>>()
		.on("start", function onStart(event: BlockDragEvent<S>, node) {})
		.on("drag", function onDrag(event: BlockDragEvent<S>, node) {
			setNodePosition(ref, select(this), [event.x, event.y], node)
		})
		.on("end", function onEnd(event: BlockDragEvent<S>, node) {
			const position = snap([event.x, event.y], ref.unit, ref.dimensions)
			if (positionEqual(position, node.position)) {
				const { x, y } = event.subject
				setNodePosition(ref, select(this), [x, y], node)
			} else {
				ref.dispatch(actions.moveNode(node.id, position))
			}
		})
		.subject(function (event: BlockDragEvent<S>, { position: [x, y] }) {
			return { x: ref.unit * x, y: ref.unit * y }
		})
		.filter(({ target }) => target.classList.contains("header"))

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
			const [x, y] = node.position
			const [_, Y] = ref.dimensions
			if (y < Y - 1) {
				ref.dispatch(actions.moveNode(node.id, [x, y + 1]))
			}
		} else if (event.key === "ArrowUp") {
			event.preventDefault()
			const [x, y] = node.position
			if (y > 0) {
				ref.dispatch(actions.moveNode(node.id, [x, y - 1]))
			}
		} else if (event.key === "ArrowRight") {
			event.preventDefault()
			const [x, y] = node.position
			const [X] = ref.dimensions
			if (x < X - 1) {
				ref.dispatch(actions.moveNode(node.id, [x + 1, y]))
			}
		} else if (event.key === "ArrowLeft") {
			event.preventDefault()
			const [x, y] = node.position
			if (x > 0) {
				ref.dispatch(actions.moveNode(node.id, [x - 1, y]))
			}
		} else if (event.key === "Backspace") {
			event.preventDefault()
			ref.dispatch(actions.deleteNode(node.id))
		}
	}

export const updateNodes = <S extends Schema>(ref: CanvasRef<S>) => {
	const {
		foreignObjectPositionX,
		foreignObjectPositionY,
		frameTransform,
	} = getBlockPosition(ref)

	const observer = new ResizeObserver(handleResize(ref))

	const nodeDrag = nodeDragBehavior(ref)
	const nodeClick = nodeClickBehavior(ref)
	const nodeKeyDown = nodeKeyDownBehavior(ref)

	const updateInputs = updateInputPorts(ref)
	const updateOutputs = updateOutputPorts(ref)

	return () => {
		const nodes = ref.svg
			.select("g.nodes")
			.selectAll<SVGGElement, Node<S>>("g.node")
			.data<Node<S>>(ref.nodes.values(), function (node, index, groups) {
				return node.id.toString()
			})
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
						.each(({ id }) =>
							ref.contentDimensions.set(id, [minWidth, minHeight])
						)

					const frames = groups
						.append("g")
						.classed("frame", true)
						.attr("transform", frameTransform)

					const paths = frames
						.append("path")
						.attr("stroke", defaultBorderColor)
						.attr("fill", getBackgroundColor(ref.blocks))
						.attr("stroke-width", 1)

					const inputs = frames.append("g").classed("inputs", true)

					const inputPorts = inputs
						.selectAll<SVGCircleElement, Input<S>>("circle.port")
						.call(updateInputs)

					const outputs = frames.append("g").classed("outputs", true)

					const outputPorts = outputs
						.selectAll<SVGCircleElement, Output<S>>("circle.port")
						.call(updateOutputs)

					const foreignObjects = groups
						.append("foreignObject")
						.attr("x", foreignObjectPositionX)
						.attr("y", foreignObjectPositionY)

					const contents = foreignObjects
						.append<HTMLDivElement>("xhtml:div")
						.classed("content", true)
						.style("position", "fixed")
						.style("width", "max-content")
						.attr("xmlns", "http://www.w3.org/1999/xhtml")
						.each(function () {
							observer.observe(this)
						})

					return groups
				},
				(update) => {
					const frames = update
						.select("g.frame")
						.attr("transform", frameTransform)

					frames
						.select("g.inputs")
						.selectAll<SVGCircleElement, Input<S>>("circle.port")
						.call(updateInputs)

					frames
						.select("g.outputs")
						.selectAll<SVGCircleElement, Output<S>>("circle.port")
						.call(updateOutputs)

					update
						.select("foreignObject")
						.attr("x", foreignObjectPositionX)
						.attr("y", foreignObjectPositionY)

					return update
				},
				(exit) => {
					exit
						.each(function ({ id }) {
							ref.contentDimensions.delete(id)
							const content = this.querySelector("foreignObject > div.content")
							if (content !== null) {
								observer.unobserve(content)
							}
						})
						.remove()
				}
			)

		return nodes.select<HTMLDivElement>("foreignObject > div.content")
	}
}
