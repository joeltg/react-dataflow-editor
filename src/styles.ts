import React from "react"

import type { Kinds, Schema } from "./state.js"
import type { EditorContext } from "./context.js"

export const defaultBackgroundColor = "lightgray"
export const borderColor = "dimgray"

export const defaultNodeHeaderStyle: React.CSSProperties = {
	paddingTop: 4,
	cursor: "move",
	userSelect: "none",
	WebkitUserSelect: "none",
	borderBottom: `1px solid ${borderColor}`,
}

export type getEditorStyle = (context: EditorContext) => React.CSSProperties

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
	borderColor: "dimgrey",
	borderWidth: 1,
	borderStyle: "solid",
	width: "100%",
	overflowX: "scroll",
}

export const defaultStyleContext: StyleContext = {
	getCanvasStyle: () => defaultCanvasStyle,
	getSVGStyle: ({ unit, height }) => ({
		backgroundImage: `radial-gradient(circle, ${borderColor} 1px, rgba(0, 0, 0, 0) 1px)`,
		backgroundSize: `${unit}px ${unit}px`,
		backgroundPositionX: `-${unit / 2}px`,
		backgroundPositionY: `-${unit / 2}px`,
		width: "100%",
		height: unit * height,
	}),
	getNodeHeaderStyle: () => defaultNodeHeaderStyle,
	getNodeContentStyle: (kinds, kind) => {
		const { backgroundColor } = kinds[kind]
		return { position: "fixed", width: "max-content", backgroundColor }
	},
}

export const StyleContext = React.createContext(defaultStyleContext)
