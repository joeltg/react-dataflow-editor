import { ReadonlyCanvasRef, Schema, Target } from "./interfaces.js";
export declare function getTargets<S extends Schema>(ref: ReadonlyCanvasRef<S>, sourceId: string): import("d3-quadtree").Quadtree<DropTarget<S>>;
export declare type DropTarget<S extends Schema> = {
    x: number;
    y: number;
    target: Target<S, keyof S>;
};
export declare const getX: <S extends Schema>({ x }: DropTarget<S>) => number;
export declare const getY: <S extends Schema>({ y }: DropTarget<S>) => number;
