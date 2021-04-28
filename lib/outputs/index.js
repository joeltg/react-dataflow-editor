import { defaultBackgroundColor } from "../styles.js";
import { getPortOffsetY, portRadius } from "../utils.js";
export const getOutputKey = ({ source: { output }, }) => output;
export const appendOutputPorts = (enter) => {
    const circles = enter
        .append("circle")
        .classed("port", true)
        .attr("cx", 0)
        .attr("cy", ({ index }) => getPortOffsetY(index))
        .attr("r", portRadius)
        .attr("fill", defaultBackgroundColor);
    circles.append("title").text(getOutputKey).datum(null);
    return circles;
};
export const getOutputs = (ref, node) => Object.keys(ref.kinds[node.kind].outputs).map((output, index) => ({
    index,
    source: { id: node.id, output },
    value: node.outputs[output],
}));
