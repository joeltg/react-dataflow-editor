import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Toolbox } from "./Toolbox.js";
import { Canvas } from "./Canvas.js";
import { defaultCanvasUnit, defaultCanvasDimensions } from "./utils.js";
export function Editor({ unit = defaultCanvasUnit, dimensions = defaultCanvasDimensions, ...props }) {
    return (React.createElement(DndProvider, { backend: HTML5Backend },
        React.createElement("div", { className: "editor", style: { display: "flex", flexDirection: "column" } },
            React.createElement(Toolbox, { blocks: props.blocks }),
            React.createElement(Canvas, { unit: unit, blocks: props.blocks, graph: props.graph, dispatch: props.dispatch }))));
}
