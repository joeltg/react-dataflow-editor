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
exports.Portal = void 0;
const react_1 = __importStar(require("react"));
const react_dom_1 = require("react-dom");
const react_redux_1 = require("react-redux");
const actions = __importStar(require("./redux/actions.js"));
const styles_js_1 = require("./styles.js");
exports.Portal = react_1.memo(renderPortal);
function renderPortal(props) {
    const node = react_redux_1.useSelector(({ nodes }) => nodes.get(props.id));
    if (node === undefined) {
        return null;
    }
    else {
        return react_dom_1.createPortal(react_1.default.createElement(PortalContent, { node: node, blocks: props.blocks }), props.container);
    }
}
function PortalContent({ node: { id, kind, value }, blocks, }) {
    const dispatch = react_redux_1.useDispatch();
    const setValue = react_1.useCallback((value) => dispatch(actions.updateNode(id, value)), [id]);
    const { getBlockHeaderStyle, getBlockContainerStyle } = react_1.useContext(styles_js_1.StyleContext);
    const block = blocks[kind];
    const { blockHeaderStyle, blockContainerStyle } = react_1.useMemo(() => ({
        blockHeaderStyle: getBlockHeaderStyle(block),
        blockContainerStyle: getBlockContainerStyle(block),
    }), [block]);
    return (react_1.default.createElement("div", { className: "container", style: blockContainerStyle },
        react_1.default.createElement("div", { className: "header", style: blockHeaderStyle }, block.name),
        react_1.default.createElement(block.component, { value: value, setValue: setValue })));
}
