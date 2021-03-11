import { select } from "d3-selection";
import { makeCurvePath } from "./curve.js";
import { getKey, getSourcePosition, getTargetPosition } from "./utils.js";
export const updateEdges = (ref) => {
    function updateEdgePathPositions({ source, target }) {
        const sourcePosition = getSourcePosition(ref, source);
        const targetPosition = getTargetPosition(ref, target);
        select(this).attr("d", makeCurvePath(sourcePosition, targetPosition));
    }
    return () => {
        ref.edges
            .selectAll("g.edge")
            .data(Object.values(ref.graph.edges), getKey)
            .join((enter) => {
            const edges = enter
                .append("g")
                .classed("edge", true)
                .attr("data-id", getKey)
                .attr("data-source", ({ source: { id } }) => id)
                .attr("data-target", ({ target: { id } }) => id);
            edges
                .append("path")
                .classed("curve", true)
                .each(updateEdgePathPositions);
            return edges;
        }, (update) => {
            update
                .select("path.curve")
                .each(updateEdgePathPositions);
            return update;
        }, (exit) => exit.remove());
    };
};
