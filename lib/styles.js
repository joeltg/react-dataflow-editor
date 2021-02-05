"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StyleContext = exports.defaultStyleContext = exports.defaultBlockHeaderStyle = void 0;
const react_1 = __importDefault(require("react"));
const utils_js_1 = require("./utils.js");
exports.defaultBlockHeaderStyle = {
    paddingTop: 4,
    cursor: "move",
    userSelect: "none",
    WebkitUserSelect: "none",
    borderBottom: `1px solid ${utils_js_1.defaultBorderColor}`,
};
exports.defaultStyleContext = {
    getBlockHeaderStyle: () => exports.defaultBlockHeaderStyle,
};
exports.StyleContext = react_1.default.createContext(exports.defaultStyleContext);
//# sourceMappingURL=styles.js.map