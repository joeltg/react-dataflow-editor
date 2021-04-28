import { getPortOffsetY, portRadius } from "../utils.js";
import { defaultBackgroundColor } from "../styles.js";
export const getInputKey = ({ target: { input }, }) => input;
export const appendInputPorts = (enter) => {
    const circles = enter
        .append("circle")
        .classed("port", true)
        .classed("hidden", ({ value }) => value === null)
        .attr("cx", 0)
        .attr("cy", ({ index }) => getPortOffsetY(index))
        .attr("r", portRadius)
        .attr("fill", defaultBackgroundColor)
        // .attr("stroke", "inherit")
        .attr("data-input", ({ target: { input } }) => input)
        .attr("data-value", ({ value }) => value);
    circles.append("title").text(getInputKey).datum(null);
    return circles;
};
export const getInputs = (ref, node) => Object.keys(ref.kinds[node.kind].inputs).map((input, index) => {
    const value = node.inputs[input];
    const target = { id: node.id, input };
    return { index, target, value };
});
