import { borderColor } from "../styles.js";
import { nodeHeaderHeight, nodeWidth, getKey, makeClipPath, toTranslate, } from "../utils.js";
export const appendNodes = (ref, enter, attachInputs, attachOutputs) => {
    const groups = enter
        .append("g")
        .classed("node", true)
        .attr("data-id", getKey)
        .attr("tabindex", 0)
        .attr("transform", ({ position: { x, y } }) => toTranslate(x * ref.unit, y * ref.unit))
        .attr("stroke", borderColor)
        .attr("stroke-width", 1);
    groups
        .append("path")
        .attr("fill", ({ kind }) => ref.kinds[kind].backgroundColor)
        .attr("d", ({ kind }) => makeClipPath(ref.kinds, kind));
    groups
        .append("text")
        .classed("title", true)
        .attr("stroke", "none")
        .attr("x", 8)
        .attr("y", 18)
        .attr("font-size", 16)
        .text(({ kind }) => ref.kinds[kind].name);
    groups
        .append("line")
        .attr("stroke", "dimgrey")
        .attr("stroke-width", 1)
        .attr("x1", 4)
        .attr("y1", nodeHeaderHeight)
        .attr("x2", nodeWidth - 4)
        .attr("y2", nodeHeaderHeight);
    groups.append("g").classed("inputs", true).call(attachInputs);
    groups
        .append("g")
        .classed("outputs", true)
        .attr("transform", toTranslate(nodeWidth, 0))
        .call(attachOutputs);
    return groups;
};
