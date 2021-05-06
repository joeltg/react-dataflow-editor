import { drag } from "d3-drag";
import { select } from "d3-selection";
import { deleteEdge, moveEdge } from "./actions.js";
import { getTargets } from "./target.js";
import { getEdgeSource, getEdgeTarget, getSourcePosition, getTargetPosition, makeCurvePath, portRadius, } from "./utils.js";
export function makeInputDragBehavior(context, kinds, dispatch) {
    // The binding element here is a g.input > circle.port
    return drag()
        .clickDistance(15)
        .container(context.svgRef.current)
        .on("start", function onStart(event) {
        event.subject.preview.attr("display", "initial");
        const [x, y] = event.subject.sourcePosition;
        event.subject.edge.attr("display", "none");
        event.subject.preview
            .select("path")
            .attr("d", makeCurvePath([x, y], [event.x, event.y]));
        event.subject.preview.select("circle.source").attr("cx", x).attr("cy", y);
        event.subject.preview
            .selectAll("circle.target")
            .attr("cx", event.x)
            .attr("cy", event.y);
        context.onFocus({ element: "edge", id: event.subject.id });
    })
        .on("drag", function onDrag(event) {
        this.setAttribute("display", "none");
        const result = event.subject.targets.find(event.x, event.y, portRadius * 2);
        const [x, y] = result !== undefined ? [result.x, result.y] : [event.x, event.y];
        event.subject.preview.select("circle.target").attr("cx", x).attr("cy", y);
        const path = makeCurvePath(event.subject.sourcePosition, [x, y]);
        event.subject.preview.select("path").attr("d", path);
    })
        .on("end", function onEnd(event) {
        const result = event.subject.targets.find(event.x, event.y, 2 * portRadius);
        this.setAttribute("display", "initial");
        event.subject.edge.attr("display", "initial");
        if (result === undefined) {
            dispatch(deleteEdge(event.subject.id));
        }
        else if (result.target.id !== event.subject.target.id ||
            result.target.input !== event.subject.target.input) {
            dispatch(moveEdge(event.subject.id, result.target));
        }
        else {
            context.onFocus({ element: "edge", id: event.subject.id });
        }
        event.subject.preview.attr("display", "none");
        event.subject.preview.select("path").attr("d", null);
        event.subject.preview
            .selectAll("circle")
            .attr("cx", null)
            .attr("cy", null);
    })
        .subject(function (event) {
        const value = select(this.parentElement).attr("data-value");
        const edges = select(context.edgesRef.current);
        const edge = edges.select(`g.edge[data-id="${value}"]`);
        const id = edge.attr("data-id");
        const source = getEdgeSource(edge);
        const target = getEdgeTarget(edge);
        const sourcePosition = getSourcePosition(context, kinds, source);
        const [x, y] = getTargetPosition(context, kinds, target);
        const targets = getTargets(context, kinds, target);
        const preview = select(context.previewRef.current);
        return { x, y, id, edge, target, targets, sourcePosition, preview };
    });
}
