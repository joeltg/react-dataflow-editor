"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StyleContext = exports.defaultStyleContext = exports.defaultBlockHeaderStyle = exports.getBackgroundColor = exports.defaultBorderColor = exports.defaultBackgroundColor = void 0;
const react_1 = __importDefault(require("react"));
exports.defaultBackgroundColor = "lightgray";
exports.defaultBorderColor = "dimgray";
const getBackgroundColor = (blocks) => ({ kind, }) => blocks[kind].backgroundColor || exports.defaultBackgroundColor;
exports.getBackgroundColor = getBackgroundColor;
exports.defaultBlockHeaderStyle = {
    paddingTop: 4,
    cursor: "move",
    userSelect: "none",
    WebkitUserSelect: "none",
    borderBottom: `1px solid ${exports.defaultBorderColor}`,
};
exports.defaultStyleContext = {
    getSVGStyle: ({ unit }) => ({
        backgroundImage: "radial-gradient(circle, #000000 1px, rgba(0, 0, 0, 0) 1px)",
        backgroundSize: `${unit}px ${unit}px`,
        backgroundPositionX: `-${unit / 2}px`,
        backgroundPositionY: `-${unit / 2}px`,
    }),
    getBlockHeaderStyle: () => exports.defaultBlockHeaderStyle,
    getBlockContainerStyle: (block) => ({
        margin: "1px 4px",
        backgroundColor: block.backgroundColor || exports.defaultBackgroundColor,
    }),
};
exports.StyleContext = react_1.default.createContext(exports.defaultStyleContext);
