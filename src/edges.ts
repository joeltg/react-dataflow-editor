import { select } from "d3-selection"
import { makeCurvePath } from "./curve.js"
import { CanvasRef, Edge, Values } from "./interfaces.js"
import { getKey, getSourcePosition, getTargetPosition } from "./utils.js"

export const updateEdges = <V extends Values>(ref: CanvasRef<V>) => {
	function updateEdgePathPositions(this: SVGPathElement, edge: Edge) {
		const sourcePosition = getSourcePosition(ref, edge)
		const targetPosition = getTargetPosition(ref, edge)
		select(this).attr("d", makeCurvePath(sourcePosition, targetPosition))
	}

	return () =>
		ref.svg
			.select("g.edges")
			.selectAll<SVGGElement, Edge>("g.edge")
			.data<Edge>(ref.edges.values(), getKey)
			.join(
				(enter) => {
					const edges = enter
						.append("g")
						.classed("edge", true)
						.attr("data-id", getKey)

					const paths = edges
						.append("path")
						.classed("curve", true)
						.each(updateEdgePathPositions)

					return edges
				},
				(update) => {
					update
						.select<SVGPathElement>("g.edge > path")
						.each(updateEdgePathPositions)
					return update
				},
				(exit) => exit.remove()
			)
}
