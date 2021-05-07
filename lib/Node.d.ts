import React from "react";
import { DragBehavior } from "d3-drag";
import type { Focus, Kinds, Node, Schema } from "./state.js";
import { InputDragSubject } from "./inputDrag.js";
import { OutputDragSubject } from "./outputDrag.js";
import { NodeDragSubject } from "./nodeDrag.js";
export interface GraphNodeProps<S extends Schema> {
    kinds: Kinds<S>;
    focus: Focus | null;
    node: Node<S>;
    nodeDrag?: DragBehavior<SVGGElement, undefined, NodeDragSubject>;
    inputDrag?: DragBehavior<SVGCircleElement, unknown, InputDragSubject<S>>;
    outputDrag?: DragBehavior<SVGCircleElement, unknown, OutputDragSubject<S>>;
    children?: React.ReactNode;
}
export declare function GraphNode<S extends Schema>(props: GraphNodeProps<S>): JSX.Element;
