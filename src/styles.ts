import React from "react"

import type { Kinds, Node, Schema } from "./interfaces.js"

export const defaultBackgroundColor = "lightgray"
export const defaultBorderColor = "dimgray"

export const getBackgroundColor = <S extends Schema>(kinds: Kinds<S>) => (
	node: Node<S>
) => kinds[node.kind].backgroundColor || defaultBackgroundColor

export const defaultNodeHeaderStyle: React.CSSProperties = {
	paddingTop: 4,
	cursor: "move",
	userSelect: "none",
	WebkitUserSelect: "none",
	borderBottom: `1px solid ${defaultBorderColor}`,
}

export type getEditorStyle = (ref: {
	unit: number
	height: number
}) => React.CSSProperties

export type getNodeStyle = <S extends Schema>(
	kinds: Kinds<S>,
	kind: keyof S
) => React.CSSProperties

interface StyleContext {
	getCanvasStyle: getEditorStyle
	getSVGStyle: getEditorStyle
	getNodeHeaderStyle: getNodeStyle
	getNodeContentStyle: getNodeStyle
}

export const defaultCanvasStyle: React.CSSProperties = {
	border: "1px solid dimgrey",
	width: "100%",
	overflowX: "scroll",
}

export const defaultStyleContext: StyleContext = {
	getCanvasStyle: () => defaultCanvasStyle,
	getSVGStyle: ({ unit, height }) => ({
		backgroundImage:
			"radial-gradient(circle, #000000 1px, rgba(0, 0, 0, 0) 1px)",
		backgroundSize: `${unit}px ${unit}px`,
		backgroundPositionX: `-${unit / 2}px`,
		backgroundPositionY: `-${unit / 2}px`,
		width: "100%",
		height: unit * height,
	}),
	getNodeHeaderStyle: () => defaultNodeHeaderStyle,
	getNodeContentStyle: (kinds, kind) => {
		const { backgroundColor } = kinds[kind]
		return {
			position: "fixed",
			width: "max-content",
			backgroundColor: backgroundColor || defaultBackgroundColor,
		}
	},
}

export const StyleContext = React.createContext(defaultStyleContext)
