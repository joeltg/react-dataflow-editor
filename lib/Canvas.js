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
exports.Canvas = void 0;
const react_1 = __importStar(require("react"));
const react_redux_1 = require("react-redux");
const react_dnd_1 = require("react-dnd");
const d3_selection_1 = require("d3-selection");
const actions = __importStar(require("./redux/actions.js"));
const Portal_js_1 = require("./Portal.js");
const preview_js_1 = require("./preview.js");
const nodes_js_1 = require("./nodes.js");
const edges_js_1 = require("./edges.js");
const utils_js_1 = require("./utils.js");
const styles_js_1 = require("./styles.js");
const SVG_STYLE = `
g.node > foreignObject { overflow: visible }
g.node > g.frame circle.port { cursor: grab }
g.node > g.frame circle.port.hidden { display: none }
g.node > g.frame > g.outputs > circle.port.dragging { cursor: grabbing }

g.node:focus > g.frame > path { stroke-width: 3 }

g.edge.hidden { display: none }
g.edge > path.curve {
	stroke: gray;
	stroke-width: 6px;
	fill: none;
}

g.preview.hidden { display: none }
g.preview > path.curve {
	stroke: gray;
	stroke-width: 6px;
	fill: none;
	stroke-dasharray: 8 6;
}
g.preview > circle {
	fill: ${styles_js_1.defaultBackgroundColor};
	stroke: ${styles_js_1.defaultBorderColor};
	stroke-width: 4px;
}
`;
function Canvas({ blocks, onChange }) {
    const dispatch = react_redux_1.useDispatch();
    const nodes = react_redux_1.useSelector(({ nodes }) => nodes);
    const edges = react_redux_1.useSelector(({ edges }) => edges);
    const { unit, dimensions } = react_1.useContext(utils_js_1.EditorContext);
    const [X, Y] = dimensions;
    const observer = react_1.useMemo(() => new ResizeObserver((entries) => {
        nodes_js_1.handleResize(ref, entries);
    }), []);
    const ref = react_1.useMemo(() => ({
        svg: d3_selection_1.select(null),
        contentDimensions: new Map(),
        canvasDimensions: [0, 0],
        unit,
        dimensions: [X, Y],
        blocks: blocks,
        nodes,
        edges,
        dispatch,
    }), [unit, X, Y, blocks, dispatch]);
    ref.nodes = nodes;
    ref.edges = edges;
    react_1.useEffect(() => onChange(nodes, edges), [nodes, edges]);
    const svgRef = react_1.useRef(null);
    const attachSVG = react_1.useCallback((svg) => {
        svgRef.current = svg;
        ref.svg = d3_selection_1.select(svg);
        ref.svg.select("g.preview").call(preview_js_1.attachPreview);
    }, []);
    const update = react_1.useMemo(() => ({ nodes: nodes_js_1.updateNodes(ref), edges: edges_js_1.updateEdges(ref) }), []);
    const [portals, setPortals] = react_1.useState([]);
    react_1.useLayoutEffect(() => {
        const portals = [];
        // update.nodes().each(function (this: HTMLDivElement, { id }: Node<S>) {
        // 	portals.push({ id, container: this, blocks })
        // })
        update.nodes().each(function ({ id }) {
            const container = this.querySelector("foreignObject");
            if (container !== null) {
                portals.push({ id, container, blocks });
            }
        });
        setPortals(portals);
    }, [nodes]);
    react_1.useLayoutEffect(() => void update.edges(), [edges, nodes]);
    const height = unit * Y;
    const [{}, drop] = react_dnd_1.useDrop({
        accept: ["block"],
        drop({ kind }, monitor) {
            const { x, y } = monitor.getSourceClientOffset();
            const { left, top } = svgRef.current.getBoundingClientRect();
            const position = utils_js_1.snap([x - left, y - top], unit, dimensions);
            dispatch(actions.createNode(kind, position));
        },
    });
    const style = react_1.useContext(styles_js_1.StyleContext);
    const svgStyle = react_1.useMemo(() => style.getSVGStyle({ unit }), [unit]);
    return (react_1.default.createElement(utils_js_1.CanvasContext.Provider, { value: { observer } },
        react_1.default.createElement("div", { ref: drop, className: "canvas", style: { height } },
            react_1.default.createElement("svg", { ref: attachSVG, xmlns: "http://www.w3.org/2000/svg", height: height, style: svgStyle },
                react_1.default.createElement("style", null, SVG_STYLE),
                react_1.default.createElement("g", { className: "edges" }),
                react_1.default.createElement("g", { className: "nodes" }),
                react_1.default.createElement("g", { className: "preview" }),
                portals.map((props) => (react_1.default.createElement(Portal_js_1.Portal, Object.assign({ key: props.id }, props))))))));
}
exports.Canvas = Canvas;
