import { quadtree } from "d3-quadtree";
import { select } from "d3-selection";
import { getInputOffset, getNodeAttributes, place } from "./utils.js";
export function getTargets(context, kinds, target) {
    const targets = [];
    const nodes = select(context.nodesRef.current);
    for (const nodeElement of nodes.selectAll("g.node")) {
        const node = select(nodeElement);
        const { id, kind, position } = getNodeAttributes(node);
        const ports = node.selectAll("g.input");
        for (const portElement of ports) {
            const port = select(portElement);
            const input = port.attr("data-input");
            const hasValue = portElement.hasAttribute("data-value");
            const isCurrentTarget = target !== undefined && target.id === id && target.input === input;
            if (!hasValue || isCurrentTarget) {
                const offset = getInputOffset(kinds, kind, input);
                const [x, y] = place(context, position, offset);
                targets.push({ target: { id, input }, x, y });
            }
        }
    }
    return quadtree(targets, getX, getY);
}
export const getX = ({ x }) => x;
export const getY = ({ y }) => y;
