import type { Kinds, Schema, Target } from "./state.js";
import type { CanvasContext } from "./context.js";
export declare type DragTarget<S extends Schema> = {
    x: number;
    y: number;
    target: Target<S>;
};
export declare function getTargets<S extends Schema>(context: CanvasContext, kinds: Kinds<S>, target?: Target<S>): import("d3-quadtree").Quadtree<DragTarget<S>>;
export declare const getX: <S extends Schema>({ x }: DragTarget<S>) => number;
export declare const getY: <S extends Schema>({ y }: DragTarget<S>) => number;
