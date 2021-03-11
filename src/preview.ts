import { Selection } from "d3-selection"

import { makeCurvePath } from "./curve.js"
import { portRadius } from "./utils.js"

export function updatePreview(
	preview: Selection<SVGGElement | null, unknown, null, undefined>,
	[x1, y1]: [number, number],
	[x2, y2]: [number, number],
	hover: boolean
) {
	preview.select("path").attr("d", makeCurvePath([x1, y1], [x2, y2]))
	preview
		.select("circle.target")
		.attr("cx", x2)
		.attr("cy", y2)
		.attr("r", hover ? portRadius - 1.5 : portRadius)
}

export function startPreview(
	preview: Selection<SVGGElement | null, unknown, null, undefined>,
	[x1, y1]: [number, number],
	[x2, y2]: [number, number]
) {
	preview.style("cursor", "grabbing")
	preview.classed("hidden", false)
	preview.select("circle.source").attr("cx", x1).attr("cy", y1)
	preview.select("path").attr("d", makeCurvePath([x1, y1], [x2, y2]))
	preview.select("circle.target").attr("cx", x2).attr("cy", y2)
}

export function stopPreview(
	preview: Selection<SVGGElement | null, unknown, null, undefined>
) {
	preview.style("cursor", null)
	preview.classed("hidden", true)
	preview.select("path").attr("d", null)
	preview.select("circle").attr("cx", 0).attr("cy", 0)
}

export function attachPreview(
	preview: Selection<SVGGElement | null, unknown, null, undefined>
) {
	preview.classed("hidden", true)
	preview.append("path").classed("curve", true)
	preview.append("circle").classed("source", true).attr("r", portRadius)
	preview.append("circle").classed("target", true).attr("r", portRadius)
}
