import { select } from "d3-selection";
import { drag } from "d3-drag";
import { getSourcePosition, makeCurvePath, portRadius } from "./utils.js";
import { getTargets } from "./target.js";
import { createEdge } from "./actions.js";
export function makeOutputDragBehavior(context, kinds, dispatch) {
    // The binding element here is a g.output > circle
    return drag()
        .on("start", function onStart(event) {
        event.subject.preview.attr("display", null);
        event.subject.preview
            .selectAll("circle")
            .attr("cx", event.x)
            .attr("cy", event.y);
    })
        .on("drag", function onDrag(event) {
        const result = event.subject.targets.find(event.x, event.y, portRadius * 2);
        const [x, y] = result !== undefined ? [result.x, result.y] : [event.x, event.y];
        event.subject.preview.select("circle.target").attr("cx", x).attr("cy", y);
        const path = makeCurvePath([event.subject.x, event.subject.y], [x, y]);
        event.subject.preview.select("path").attr("d", path);
    })
        .on("end", function onEnd(event) {
        const result = event.subject.targets.find(event.x, event.y, 2 * portRadius);
        if (result !== undefined) {
            const { target } = result;
            dispatch(createEdge(event.subject.source, target));
        }
        event.subject.preview.attr("display", "none");
        event.subject.preview
            .selectAll("circle")
            .attr("cx", null)
            .attr("cy", null);
        event.subject.preview.select("path").attr("d", null);
    })
        .subject(function (event) {
        const targets = getTargets(context, kinds);
        const port = select(this.parentElement);
        const id = port.attr("data-id");
        const output = port.attr("data-output");
        const source = { id, output };
        const [x, y] = getSourcePosition(context, kinds, source);
        const preview = select(context.previewRef.current);
        return { x, y, targets, source, preview };
    });
}
