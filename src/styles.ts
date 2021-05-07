import React, { useContext, useMemo } from "react"
import { CanvasContext } from "./context.js"

import { Options } from "./options.js"

export const getCanvasStyle = ({
	borderColor,
}: Options): React.CSSProperties => ({
	borderColor,
	borderWidth: 1,
	borderStyle: "solid",
	width: "100%",
	overflowX: "scroll",
})

export const getSVGStyle = ({
	borderColor,
	unit,
	height,
}: Options): React.CSSProperties => ({
	backgroundImage: `radial-gradient(circle, ${borderColor} 1px, rgba(0, 0, 0, 0) 1px)`,
	backgroundSize: `${unit}px ${unit}px`,
	backgroundPositionX: `-${unit / 2}px`,
	backgroundPositionY: `-${unit / 2}px`,
	width: "100%",
	height: unit * height,
	userSelect: "none",
})

export const defaultStyleContext = { getCanvasStyle, getSVGStyle }

export const StyleContext = React.createContext(defaultStyleContext)

export function useStyles() {
	const { options } = useContext(CanvasContext)
	const { getCanvasStyle, getSVGStyle } = useContext(StyleContext)
	return useMemo(
		() => ({ canvas: getCanvasStyle(options), svg: getSVGStyle(options) }),
		[]
	)
}
