import { getPortOffsetY, portRadius } from "../utils.js";
import { defaultBackgroundColor, defaultBorderColor } from "../styles.js";
export const getInputKey = ({ target: { input }, }) => input;
export const appendInputPorts = (enter) => {
    const circles = enter
        .append("circle")
        .classed("port", true)
        .attr("cx", 0)
        .attr("cy", ({ index }) => getPortOffsetY(index))
        .attr("r", portRadius)
        .attr("fill", defaultBackgroundColor)
        .attr("stroke", defaultBorderColor)
        .classed("hidden", ({ value }) => value === null);
    circles.append("title").text(getInputKey).datum(null);
    return circles;
};
export const getInputs = (ref, node) => Object.keys(ref.blocks[node.kind].inputs).map((input, index) => {
    const value = node.inputs[input];
    const target = { id: node.id, input };
    return { index, target, value };
});
