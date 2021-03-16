import React from "react";
export const defaultBackgroundColor = "lightgray";
export const defaultBorderColor = "dimgray";
export const getBackgroundColor = (blocks) => ({ kind, }) => blocks[kind].backgroundColor || defaultBackgroundColor;
export const defaultBlockHeaderStyle = {
    paddingTop: 4,
    cursor: "move",
    userSelect: "none",
    WebkitUserSelect: "none",
    borderBottom: `1px solid ${defaultBorderColor}`,
};
export const defaultCanvasStyle = {
    border: "1px solid dimgrey",
    width: "100%",
    overflowX: "scroll",
};
export const defaultStyleContext = {
    getCanvasStyle: () => defaultCanvasStyle,
    getSVGStyle: ({ unit, height }) => ({
        backgroundImage: "radial-gradient(circle, #000000 1px, rgba(0, 0, 0, 0) 1px)",
        backgroundSize: `${unit}px ${unit}px`,
        backgroundPositionX: `-${unit / 2}px`,
        backgroundPositionY: `-${unit / 2}px`,
        width: "100%",
        height: unit * height,
    }),
    getBlockHeaderStyle: () => defaultBlockHeaderStyle,
    getBlockContentStyle: (block) => ({
        position: "fixed",
        width: "max-content",
        backgroundColor: block.backgroundColor || defaultBackgroundColor,
    }),
};
export const StyleContext = React.createContext(defaultStyleContext);
