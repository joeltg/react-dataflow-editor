import React from "react"

import { Blocks, Node, Schema } from "./interfaces.js"

export const defaultBackgroundColor = "lightgray"
export const defaultBorderColor = "dimgray"

export const getBackgroundColor = <S extends Schema>(blocks: Blocks<S>) => ({
	kind,
}: Node<S>) => blocks[kind].backgroundColor || defaultBackgroundColor

export const defaultBlockHeaderStyle: React.CSSProperties = {
	paddingTop: 4,
	cursor: "move",
	userSelect: "none",
	WebkitUserSelect: "none",
	borderBottom: `1px solid ${defaultBorderColor}`,
}

export type getEditorStyle = (ctx: { unit: number }) => React.CSSProperties

export type getBlockStyle = <S extends Schema>(
	block: Blocks<S>[keyof S]
) => React.CSSProperties

interface StyleContext {
	getCanvasStyle: getEditorStyle
	getSVGStyle: getEditorStyle
	getBlockHeaderStyle: getBlockStyle
	getBlockContentStyle: getBlockStyle
}

export const defaultCanvasStyle: React.CSSProperties = {
	border: "1px solid dimgrey",
	width: "100%",
	overflowX: "scroll",
}

export const defaultStyleContext: StyleContext = {
	getCanvasStyle: () => defaultCanvasStyle,
	getSVGStyle: ({ unit }) => ({
		backgroundImage:
			"radial-gradient(circle, #000000 1px, rgba(0, 0, 0, 0) 1px)",
		backgroundSize: `${unit}px ${unit}px`,
		backgroundPositionX: `-${unit / 2}px`,
		backgroundPositionY: `-${unit / 2}px`,
		width: "100%",
		height: 640,
	}),
	getBlockHeaderStyle: () => defaultBlockHeaderStyle,
	getBlockContentStyle: (block) => ({
		position: "fixed",
		width: "max-content",
		backgroundColor: block.backgroundColor || defaultBackgroundColor,
	}),
}

export const StyleContext = React.createContext(defaultStyleContext)
