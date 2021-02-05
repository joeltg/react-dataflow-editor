"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEdges = void 0;
const d3_selection_1 = require("d3-selection");
const curve_js_1 = require("./curve.js");
const utils_js_1 = require("./utils.js");
const updateEdges = (ref) => {
    function updateEdgePathPositions(edge) {
        const sourcePosition = utils_js_1.getSourcePosition(ref, edge);
        const targetPosition = utils_js_1.getTargetPosition(ref, edge);
        d3_selection_1.select(this).attr("d", curve_js_1.makeCurvePath(sourcePosition, targetPosition));
    }
    return () => ref.svg
        .select("g.edges")
        .selectAll("g.edge")
        .data(ref.edges.values(), utils_js_1.getKey)
        .join((enter) => {
        const edges = enter
            .append("g")
            .classed("edge", true)
            .attr("data-id", utils_js_1.getKey);
        const paths = edges
            .append("path")
            .classed("curve", true)
            .each(updateEdgePathPositions);
        return edges;
    }, (update) => {
        update
            .select("g.edge > path")
            .each(updateEdgePathPositions);
        return update;
    }, (exit) => exit.remove());
};
exports.updateEdges = updateEdges;
//# sourceMappingURL=edges.js.map