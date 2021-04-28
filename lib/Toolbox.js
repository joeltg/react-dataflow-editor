import React from "react";
import { useDrag } from "react-dnd";
import { defaultBackgroundColor, defaultBorderColor } from "./styles.js";
import { portMargin } from "./utils.js";
export function PreviewNode(props) {
    const { backgroundColor, name } = props.kinds[props.kind];
    const [_, drag] = useDrag({ type: "node", item: { kind: props.kind } });
    return (React.createElement("div", { ref: drag, className: "abstract", style: {
            cursor: "move",
            margin: "1em",
            display: "flex",
            alignItems: "center",
            padding: portMargin,
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: defaultBorderColor,
            backgroundColor: backgroundColor || defaultBackgroundColor,
        } },
        React.createElement("div", { style: {
                flex: 1,
                marginLeft: portMargin / 2,
                marginRight: portMargin / 2,
            } }, name)));
}
export function Toolbox(props) {
    return (React.createElement("div", { style: { display: "flex" }, className: "toolbox" }, Object.keys(props.kinds).map((key) => {
        const kind = key;
        return React.createElement(PreviewNode, { key: key, kind: kind, kinds: props.kinds });
    })));
}
