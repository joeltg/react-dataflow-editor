import { quadtree } from "d3-quadtree";
import { forInputs, getPortOffsetY } from "./utils.js";
export function getTargets(ref, sourceId) {
    const targets = [];
    for (const node of Object.values(ref.graph.nodes)) {
        if (node.id === sourceId) {
            continue;
        }
        else {
            const { x, y } = node.position;
            for (const [index, input] of forInputs(ref.kinds, node.kind)) {
                if (node.inputs[input] === null) {
                    targets.push({
                        target: { id: node.id, input },
                        x: x * ref.unit,
                        y: y * ref.unit + getPortOffsetY(index),
                    });
                }
            }
        }
    }
    return quadtree(targets, getX, getY);
}
export const getX = ({ x }) => x;
export const getY = ({ y }) => y;
