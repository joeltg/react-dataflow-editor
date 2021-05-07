import React, { createContext } from "react"

import type { Focus } from "./state.js"
import { Options, defaultOptions } from "./options.js"

export interface CanvasContext {
	options: Options
	svgRef: React.MutableRefObject<SVGSVGElement | null>
	nodesRef: React.MutableRefObject<SVGGElement | null>
	edgesRef: React.MutableRefObject<SVGGElement | null>
	previewRef: React.MutableRefObject<SVGGElement | null>
	onFocus: (subject: Focus | null) => void
}

export const CanvasContext = createContext<CanvasContext>({
	options: defaultOptions,
	svgRef: { current: null },
	nodesRef: { current: null },
	edgesRef: { current: null },
	previewRef: { current: null },
	onFocus: (subject) => {},
})
