import React from "react"
import { useDrag } from "react-dnd"

import { Blocks, Schema } from "./interfaces.js"
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

export interface AbstractBlockViewProps<S extends Schema> {
	kind: keyof S
	blocks: Blocks<S>
}

export function AbstractBlockView<S extends Schema>({
	kind,
	blocks,
}: AbstractBlockViewProps<S>) {
	const block = blocks[kind]
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

export interface ToolboxProps<S extends Schema> {
	blocks: Blocks<S>
}

export function Toolbox<S extends Schema>({ blocks }: ToolboxProps<S>) {
	return (
		<div style={{ display: "flex" }} className="toolbox">
			{Object.keys(blocks).map((key) => {
				const kind = key as keyof S
				return <AbstractBlockView key={key} kind={kind} blocks={blocks} />
			})}
		</div>
	)
}
