import { defaultBorderColor, getBackgroundColor } from "../styles.js";
import { blockHeaderHeight, blockWidth, getKey, makeClipPath, portHeight, toTranslate, } from "../utils.js";
export const appendNodes = (ref, enter, attachInputs, attachOutputs) => {
    const groups = enter
        .append("g")
        .classed("node", true)
        .attr("data-id", getKey)
        .attr("tabindex", 0)
        .attr("transform", ({ position: { x, y } }) => toTranslate(x * ref.unit, y * ref.unit))
        .attr("stroke", defaultBorderColor)
        .attr("stroke-width", 1);
    groups
        .append("path")
        .attr("fill", getBackgroundColor(ref.blocks))
        .attr("d", function ({ kind }) {
        const { inputs, outputs } = ref.blocks[kind];
        const { length: inputCount } = Object.keys(inputs);
        const { length: outputCount } = Object.keys(outputs);
        const w = blockWidth;
        const h = blockHeaderHeight + portHeight * Math.max(inputCount, outputCount);
        return makeClipPath(inputCount, [w, h]);
    });
    groups
        .append("text")
        .classed("title", true)
        .attr("stroke", "none")
        .attr("x", 8)
        .attr("y", 18)
        .attr("font-size", 16)
        .text(({ kind }) => ref.blocks[kind].name);
    groups
        .append("line")
        .attr("stroke", "dimgrey")
        .attr("stroke-width", 1)
        .attr("x1", 4)
        .attr("y1", blockHeaderHeight)
        .attr("x2", blockWidth - 4)
        .attr("y2", blockHeaderHeight);
    groups.append("g").classed("inputs", true).call(attachInputs);
    groups
        .append("g")
        .classed("outputs", true)
        .attr("transform", toTranslate(blockWidth, 0))
        .call(attachOutputs);
    return groups;
};
