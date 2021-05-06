/// <reference types="react" />
import { DragBehavior } from "d3-drag";
import type { Focus, GetInputs, Schema } from "./state.js";
import { InputDragSubject } from "./inputDrag.js";
export interface GraphInputProps<S extends Schema> {
    focus: Focus | null;
    inputDrag?: DragBehavior<SVGCircleElement, unknown, InputDragSubject<S>>;
    id: string;
    input: GetInputs<S>;
    index: number;
    value: string | null;
}
export declare function GraphInput<S extends Schema>(props: GraphInputProps<S>): JSX.Element;
