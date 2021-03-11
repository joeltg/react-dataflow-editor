import React, { memo } from "react";
import { useDrag } from "react-dnd";
import { defaultBackgroundColor, defaultBorderColor } from "./styles.js";
import { portMargin } from "./utils.js";
export function AbstractBlockView({ kind, blocks, }) {
    const block = blocks[kind];
    const [_, drag] = useDrag({ item: { type: "block", kind } });
    return (React.createElement("div", { ref: drag, style: {
            cursor: "move",
            margin: "1em",
            display: "flex",
            alignItems: "center",
            padding: portMargin,
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: defaultBorderColor,
            backgroundColor: block.backgroundColor || defaultBackgroundColor,
        } },
        React.createElement("div", { style: {
                flex: 1,
                marginLeft: portMargin / 2,
                marginRight: portMargin / 2,
            } }, block.name)));
}
function renderToolbox({ blocks }) {
    return (React.createElement("div", { style: { display: "flex" }, className: "toolbox" }, Object.keys(blocks).map((key) => {
        const kind = key;
        return React.createElement(AbstractBlockView, { key: key, kind: kind, blocks: blocks });
    })));
}
export const Toolbox = memo(renderToolbox);
