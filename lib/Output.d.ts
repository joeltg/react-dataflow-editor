/// <reference types="react" />
import { DragBehavior } from "d3-drag";
import type { Schema, GetOutputs, Focus } from "./state.js";
import { OutputDragSubject } from "./outputDrag.js";
export interface GraphOutputProps<S extends Schema> {
    focus: Focus | null;
    outputDrag?: DragBehavior<SVGCircleElement, unknown, OutputDragSubject<S>>;
    id: string;
    output: GetOutputs<S>;
    index: number;
    values: string[];
}
export declare function GraphOutput<S extends Schema>(props: GraphOutputProps<S>): JSX.Element;
