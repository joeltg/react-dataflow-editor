import { Selection } from "d3-selection";
import { DragBehavior } from "d3-drag";
import { Quadtree } from "d3-quadtree";
import type { Schema, Source, Kinds } from "./state.js";
import { CanvasContext } from "./context.js";
import { DragTarget } from "./target.js";
import { EditorAction } from "./actions.js";
export declare type OutputDragSubject<S extends Schema> = {
    x: number;
    y: number;
    targets: Quadtree<DragTarget<S>>;
    source: Source<S>;
    preview: Selection<SVGGElement | null, unknown, null, undefined>;
};
export declare function makeOutputDragBehavior<S extends Schema>(context: CanvasContext, kinds: Kinds<S>, dispatch: (action: EditorAction<S>) => void): DragBehavior<SVGCircleElement, unknown, OutputDragSubject<S>>;
