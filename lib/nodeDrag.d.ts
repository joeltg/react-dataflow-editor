import { Selection } from "d3-selection";
import { DragBehavior } from "d3-drag";
import type { Kinds, Position, Schema } from "./state.js";
import { CanvasContext } from "./context.js";
import { EditorAction } from "./actions.js";
declare type IncomingEdge = {
    sourcePosition: [number, number];
    inputOffset: [number, number];
};
declare type OutgoingEdge = {
    targetPosition: [number, number];
    outputOffset: [number, number];
};
export declare type NodeDragSubject = {
    x: number;
    y: number;
    id: string;
    incoming: Selection<SVGGElement, IncomingEdge, SVGGElement | null, undefined>;
    outgoing: Selection<SVGGElement, OutgoingEdge, SVGGElement | null, undefined>;
    position: Position;
};
export declare function makeNodeDragBehavior<S extends Schema>(context: CanvasContext, kinds: Kinds<S>, dispatch: (action: EditorAction<S>) => void): DragBehavior<SVGGElement, undefined, NodeDragSubject>;
export {};
