import { DragBehavior } from "d3-drag";
import { Quadtree } from "d3-quadtree";
import { Selection } from "d3-selection";
import type { Kinds, Schema, Target } from "./state.js";
import { EditorAction } from "./actions.js";
import { CanvasContext } from "./context.js";
import { DragTarget } from "./target.js";
export declare type InputDragSubject<S extends Schema> = {
    x: number;
    y: number;
    id: string;
    edge: Selection<SVGGElement, unknown, null, undefined>;
    target: Target<S>;
    targets: Quadtree<DragTarget<S>>;
    sourcePosition: [number, number];
    preview: Selection<SVGGElement | null, unknown, null, undefined>;
};
export declare function makeInputDragBehavior<S extends Schema>(context: CanvasContext, kinds: Kinds<S>, dispatch: (action: EditorAction<S>) => void): DragBehavior<SVGCircleElement, unknown, InputDragSubject<S>>;
