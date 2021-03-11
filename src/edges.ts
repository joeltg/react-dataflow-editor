import { select } from "d3-selection"
import { makeCurvePath } from "./curve.js"
import { CanvasRef, Edge, Schema } from "./interfaces.js"
import { getKey, getSourcePosition, getTargetPosition } from "./utils.js"

export const updateEdges = <S extends Schema>(ref: CanvasRef<S>) => {
	function updateEdgePathPositions(
		this: SVGPathElement,
		{ source, target }: Edge<S>
	) {
		const sourcePosition = getSourcePosition(ref, source)
		const targetPosition = getTargetPosition(ref, target)
		select(this).attr("d", makeCurvePath(sourcePosition, targetPosition))
	}

	return () => {
		ref.edges
			.selectAll<SVGGElement, Edge<S>>("g.edge")
			.data<Edge<S>>(Object.values(ref.graph.edges), getKey)
			.join(
				(enter) => {
					const edges = enter
						.append("g")
						.classed("edge", true)
						.attr("data-id", getKey)
						.attr("data-source", ({ source: { id } }) => id)
						.attr("data-target", ({ target: { id } }) => id)

					edges
						.append("path")
						.classed("curve", true)
						.each(updateEdgePathPositions)

					return edges
				},
				(update) => {
					update
						.select<SVGPathElement>("path.curve")
						.each(updateEdgePathPositions)
					return update
				},
				(exit) => exit.remove()
			)
	}
}
