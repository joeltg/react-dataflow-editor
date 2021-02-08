"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Editor = void 0;
const react_1 = __importStar(require("react"));
const redux_1 = require("redux");
const react_redux_1 = require("react-redux");
const react_dnd_1 = require("react-dnd");
const react_dnd_html5_backend_1 = require("react-dnd-html5-backend");
const Toolbox_js_1 = require("./Toolbox.js");
const utils_js_1 = require("./utils.js");
const reducers_js_1 = require("./redux/reducers.js");
const Canvas_js_1 = require("./Canvas.js");
function Editor({ unit = utils_js_1.defaultCanvasUnit, dimensions, blocks, initialState, onChange, }) {
    const store = react_1.useMemo(() => redux_1.createStore(reducers_js_1.rootReducer(blocks, initialState)), []);
    return (react_1.default.createElement(utils_js_1.EditorContext.Provider, { value: { unit, dimensions } },
        react_1.default.createElement(react_redux_1.Provider, { store: store },
            react_1.default.createElement(react_dnd_1.DndProvider, { backend: react_dnd_html5_backend_1.HTML5Backend },
                react_1.default.createElement("div", { className: "editor", style: { display: "flex", flexDirection: "column" } },
                    react_1.default.createElement(Toolbox_js_1.Toolbox, { blocks: blocks }),
                    react_1.default.createElement(Canvas_js_1.Canvas, { blocks: blocks, onChange: onChange }))))));
}
exports.Editor = Editor;
