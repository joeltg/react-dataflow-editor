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
const react_dom_1 = require("react-dom");
const react_redux_1 = require("react-redux");
const react_dnd_1 = require("react-dnd");
const d3_selection_1 = require("d3-selection");
const actions = __importStar(require("./redux/actions.js"));
const Block_js_1 = require("./Block.js");
const preview_js_1 = require("./preview.js");
const nodes_js_1 = require("./nodes.js");
const edges_js_1 = require("./edges.js");
const utils_js_1 = require("./utils.js");
const svgStyle = `
g.node > foreignObject { overflow: visible }
g.node > g.frame circle.port { cursor: grab }
g.node > g.frame circle.port.hidden { display: none }
g.node > g.frame > g.outputs > circle.port.dragging { cursor: grabbing }

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
	fill: ${utils_js_1.defaultBackgroundColor};
	stroke: ${utils_js_1.defaultBorderColor};
	stroke-width: 4px;
}
`;
function Canvas({ unit, dimensions, schema, onChange, }) {
    const dispatch = react_redux_1.useDispatch();
    const nodes = react_redux_1.useSelector(({ nodes }) => nodes);
    const edges = react_redux_1.useSelector(({ edges }) => edges);
    const [X, Y] = dimensions;
    const ref = react_1.useMemo(() => ({
        svg: d3_selection_1.select(null),
        contentDimensions: new Map(),
        canvasDimensions: [0, 0],
        unit,
        dimensions: [X, Y],
        schema,
        nodes,
        edges,
        dispatch,
    }), [unit, X, Y, schema, dispatch]);
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
    const [children, setChildren] = react_1.useState([]);
    react_1.useLayoutEffect(() => {
        const children = [];
        update.nodes().each(function ({ id }) {
            children.push([id, this]);
        });
        setChildren(children);
    }, [nodes]);
    react_1.useLayoutEffect(() => {
        update.edges();
    }, [edges, nodes]);
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
    return (react_1.default.createElement("div", { ref: drop, className: "canvas", style: { height } },
        react_1.default.createElement("svg", { ref: attachSVG, xmlns: "http://www.w3.org/2000/svg", height: height, style: {
                backgroundImage: "radial-gradient(circle, #000000 1px, rgba(0, 0, 0, 0) 1px)",
                backgroundSize: `${unit}px ${unit}px`,
                backgroundPositionX: `-${unit / 2}px`,
                backgroundPositionY: `-${unit / 2}px`,
            } },
            react_1.default.createElement("style", null, svgStyle),
            react_1.default.createElement("g", { className: "edges" }),
            react_1.default.createElement("g", { className: "nodes" }),
            react_1.default.createElement("g", { className: "preview" }),
            children.map(([id, container]) => (react_1.default.createElement(Portal, { key: id, id: id, schema: schema, container: container }))))));
}
exports.Canvas = Canvas;
const portal = ({ container, id, schema, }) => {
    return react_dom_1.createPortal(react_1.default.createElement(Block_js_1.BlockContent, { id: id, schema: schema }), container);
};
const Portal = react_1.memo(portal);
//# sourceMappingURL=Canvas.js.map