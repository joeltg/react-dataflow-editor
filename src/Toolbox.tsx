import React from "react"
import { useDrag } from "react-dnd"

import type { Kinds, Schema } from "./interfaces.js"
import { defaultBackgroundColor, defaultBorderColor } from "./styles.js"
import { portMargin } from "./utils.js"

export interface PreviewNodeProps<S extends Schema> {
	kind: keyof S
	kinds: Kinds<S>
}

export function PreviewNode<S extends Schema>(props: PreviewNodeProps<S>) {
	const { backgroundColor, name } = props.kinds[props.kind]
	const [_, drag] = useDrag({ type: "node", item: { kind: props.kind } })
	return (
		<div
			ref={drag}
			className="abstract"
			style={{
				cursor: "move",
				margin: "1em",
				display: "flex",
				alignItems: "center",
				padding: portMargin,
				borderWidth: 1,
				borderStyle: "solid",
				borderColor: defaultBorderColor,
				backgroundColor: backgroundColor || defaultBackgroundColor,
			}}
		>
			<div
				style={{
					flex: 1,
					marginLeft: portMargin / 2,
					marginRight: portMargin / 2,
				}}
			>
				{name}
			</div>
		</div>
	)
}

export interface ToolboxProps<S extends Schema> {
	kinds: Kinds<S>
}

export function Toolbox<S extends Schema>(props: ToolboxProps<S>) {
	return (
		<div style={{ display: "flex" }} className="toolbox">
			{Object.keys(props.kinds).map((key) => {
				const kind = key as keyof S
				return <PreviewNode key={key} kind={kind} kinds={props.kinds} />
			})}
		</div>
	)
}
