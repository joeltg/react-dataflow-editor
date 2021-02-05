import React from "react"
import { useDrag } from "react-dnd"

import { Schema, Values } from "./interfaces.js"
import {
	defaultBackgroundColor,
	defaultBorderColor,
	portMargin,
	portRadius,
} from "./utils.js"

const portStyle: React.CSSProperties = {
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	width: portRadius * 2,
	height: portRadius * 2,
	borderRadius: portRadius,
	border: `1px solid ${defaultBorderColor}`,
	backgroundColor: defaultBackgroundColor,
	boxSizing: "border-box",
}

export interface AbstractBlockViewProps<V extends Values> {
	kind: keyof V
	schema: Schema<V>
}

export function AbstractBlockView<V extends Values>({
	kind,
	schema,
}: AbstractBlockViewProps<V>) {
	const block = schema[kind]
	const [_, drag] = useDrag({ item: { type: "block", kind } })
	return (
		<div
			ref={drag}
			style={{
				cursor: "move",
				margin: "1em",
				display: "flex",
				alignItems: "center",
				padding: portMargin,
				borderWidth: 1,
				borderStyle: "solid",
				borderColor: defaultBorderColor,
				backgroundColor: block.backgroundColor || defaultBackgroundColor,
			}}
		>
			<div
				style={{
					flex: 1,
					marginLeft: portMargin / 2,
					marginRight: portMargin / 2,
				}}
			>
				{block.name}
			</div>
		</div>
	)
}

export interface ToolboxProps<V extends Values> {
	schema: Schema<V>
}

export function Toolbox<V extends Values>({ schema }: ToolboxProps<V>) {
	return (
		<div style={{ display: "flex" }} className="toolbox">
			{Object.keys(schema).map((key) => {
				const kind = key as keyof V
				return <AbstractBlockView key={key} kind={kind} schema={schema} />
			})}
		</div>
	)
}
