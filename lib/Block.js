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
exports.BlockContent = void 0;
const react_1 = __importStar(require("react"));
const react_redux_1 = require("react-redux");
const actions = __importStar(require("./redux/actions.js"));
const utils_js_1 = require("./utils.js");
const styles_js_1 = require("./styles.js");
function BlockContent({ id, blocks, }) {
    const node = react_redux_1.useSelector(({ nodes }) => {
        const node = nodes.get(id);
        return node === undefined ? null : node;
    });
    if (node === null) {
        return null;
    }
    else {
        return react_1.default.createElement(InnerBlockContent, { node: node, blocks: blocks });
    }
}
exports.BlockContent = BlockContent;
function InnerBlockContent({ node: { id, kind, value }, blocks, }) {
    const dispatch = react_redux_1.useDispatch();
    const setValue = react_1.useCallback((value) => dispatch(actions.updateNode(id, value)), [id]);
    const { getBlockHeaderStyle } = react_1.useContext(styles_js_1.StyleContext);
    const block = blocks[kind];
    const blockHeaderStyle = react_1.useMemo(() => getBlockHeaderStyle(block), [block]);
    return (react_1.default.createElement("div", { style: {
            margin: "1px 4px",
            backgroundColor: block.backgroundColor || utils_js_1.defaultBackgroundColor,
        } },
        react_1.default.createElement("div", { className: "header", style: blockHeaderStyle }, block.name),
        react_1.default.createElement(block.component, { value: value, setValue: setValue })));
}
//# sourceMappingURL=Block.js.map