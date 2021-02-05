import React from "react"
import { Block, Schema, Values } from "./interfaces.js"
import { defaultBorderColor } from "./utils.js"

export const defaultBlockHeaderStyle: React.CSSProperties = {
	paddingTop: 4,
	cursor: "move",
	userSelect: "none",
	WebkitUserSelect: "none",
	borderBottom: `1px solid ${defaultBorderColor}`,
}

export type getBlockHeaderStyle = <V extends Values>(
	block: Schema<V>[keyof V]
) => React.CSSProperties

interface StyleContext {
	getBlockHeaderStyle: getBlockHeaderStyle
}

export const defaultStyleContext: StyleContext = {
	getBlockHeaderStyle: () => defaultBlockHeaderStyle,
}

export const StyleContext = React.createContext(defaultStyleContext)
