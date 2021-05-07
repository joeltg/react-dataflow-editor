/// <reference types="react" />
import { DragBehavior } from "d3-drag";
import type { Focus, GetInputs, Kinds, Node, Schema } from "./state.js";
import { InputDragSubject } from "./inputDrag.js";
export interface GraphInputProps<S extends Schema, K extends keyof S> {
    kinds: Kinds<S>;
    focus: Focus | null;
    node: Node<S, K>;
    input: GetInputs<S, K>;
    inputDrag?: DragBehavior<SVGCircleElement, unknown, InputDragSubject<S>>;
}
export declare function GraphInput<S extends Schema, K extends keyof S>(props: GraphInputProps<S, K>): JSX.Element;
