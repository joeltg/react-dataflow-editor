import React, { useCallback, useContext, useMemo } from "react"
import { select } from "d3-selection"
import { DragBehavior } from "d3-drag"

import type { Focus, Kinds, Node, Schema } from "./state.js"
import { borderColor } from "./styles.js"
import {
	makeClipPath,
	nodeHeaderHeight,
	nodeMarginX,
	nodeWidth,
	place,
	toTranslate,
} from "./utils.js"
import { EditorContext } from "./context.js"

import { GraphInput } from "./Input.js"
import { GraphOutput } from "./Output.js"
import { InputDragSubject } from "./inputDrag.js"
import { OutputDragSubject } from "./outputDrag.js"
import { NodeDragSubject } from "./nodeDrag.js"

export interface GraphNodeProps<S extends Schema> {
	kinds: Kinds<S>
	focus: Focus | null
	node: Node<S>
	nodeDrag?: DragBehavior<SVGGElement, undefined, NodeDragSubject>
	inputDrag?: DragBehavior<SVGCircleElement, unknown, InputDragSubject<S>>
	outputDrag?: DragBehavior<SVGCircleElement, unknown, OutputDragSubject<S>>
	children?: React.ReactNode
}

export function GraphNode<S extends Schema>(props: GraphNodeProps<S>) {
	const { name, backgroundColor } = props.kinds[props.node.kind]

	const clipPath = useMemo(() => makeClipPath(props.kinds, props.node.kind), [])

	const inputEntries = useMemo(
		() => Object.entries<string | null>(props.node.inputs),
		[props.node.inputs]
	)

	const outputEntries = useMemo(
		() => Object.entries<string[]>(props.node.outputs),
		[props.node.outputs]
	)

	const context = useContext(EditorContext)

	const ref = useCallback((g: SVGGElement | null) => {
		if (g !== null && props.nodeDrag) {
			select<SVGGElement, undefined>(g).call(props.nodeDrag)
		}
	}, [])

	const handleClick = useCallback((event: React.MouseEvent<SVGGElement>) => {
		context.onFocus({ element: "node", id: props.node.id })
	}, [])

	const transform = toTranslate(place(context, props.node.position))
	const isFocused =
		props.focus !== null &&
		props.focus.element === "node" &&
		props.focus.id === props.node.id

	return (
		<g
			ref={ref}
			className={isFocused ? "node focus" : "node"}
			data-id={props.node.id}
			data-kind={props.node.kind}
			data-position-x={props.node.position.x}
			data-position-y={props.node.position.y}
			stroke={borderColor}
			strokeWidth={isFocused ? 3 : 1}
			transform={transform}
			cursor="grab"
			style={{ outline: "none" }}
			onClick={handleClick}
		>
			<path fill={backgroundColor} d={clipPath} />
			<text stroke="none" x={8} y={18}>
				{name}
			</text>
			{props.children}
			<line
				stroke={borderColor}
				strokeWidth={1}
				x1={nodeMarginX}
				y1={nodeHeaderHeight}
				x2={nodeWidth - nodeMarginX}
				y2={nodeHeaderHeight}
			/>
			<g className="inputs">
				{inputEntries.map(([input, value], index) => (
					<GraphInput<S>
						key={input}
						focus={props.focus}
						inputDrag={props.inputDrag}
						id={props.node.id}
						input={input}
						index={index}
						value={value}
					/>
				))}
			</g>
			<g className="outputs" transform="translate(156, 0)">
				{outputEntries.map(([output, values], index) => (
					<GraphOutput<S>
						key={output}
						focus={props.focus}
						outputDrag={props.outputDrag}
						id={props.node.id}
						output={output}
						index={index}
						values={values}
					/>
				))}
			</g>
		</g>
	)
}
