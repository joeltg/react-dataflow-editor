/// <reference types="react" />
import { DragBehavior } from "d3-drag";
import type { Schema, GetOutputs, Focus, Kinds, Node } from "./state.js";
import { OutputDragSubject } from "./outputDrag.js";
export interface GraphOutputProps<S extends Schema, K extends keyof S> {
    kinds: Kinds<S>;
    focus: Focus | null;
    node: Node<S, K>;
    output: GetOutputs<S, K>;
    outputDrag?: DragBehavior<SVGCircleElement, unknown, OutputDragSubject<S>>;
}
export declare function GraphOutput<S extends Schema, K extends keyof S>(props: GraphOutputProps<S, K>): JSX.Element;
