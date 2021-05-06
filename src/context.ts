import React, { createContext } from "react"
import { Focus } from "./state"

export const defaultCanvasUnit = 52
export const defaultCanvasHeight = 12

export interface EditorContext {
	unit: number
	height: number
	editable: boolean
	svgRef: React.MutableRefObject<SVGSVGElement | null>
	nodesRef: React.MutableRefObject<SVGGElement | null>
	edgesRef: React.MutableRefObject<SVGGElement | null>
	previewRef: React.MutableRefObject<SVGGElement | null>
	onFocus: (subject: Focus | null) => void
}

export const EditorContext = createContext<EditorContext>({
	unit: defaultCanvasUnit,
	height: defaultCanvasHeight,
	editable: false,
	svgRef: { current: null },
	nodesRef: { current: null },
	edgesRef: { current: null },
	previewRef: { current: null },
	onFocus: (subject) => {},
})
