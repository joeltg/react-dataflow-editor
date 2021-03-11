import { CanvasRef, Schema, Target, Position, Source } from "./interfaces.js";
export declare const blockWidth = 144;
export declare const portRadius = 12;
export declare const portMargin = 12;
export declare const portHeight: number;
export declare function makeClipPath(inputCount: number, [width, height]: [number, number]): string;
export declare const getKey: ({ id }: {
    id: string;
}) => string;
export declare const toTranslate: (x: number, y: number) => string;
export declare const getSourceIndex: <S extends Schema>(ref: CanvasRef<S>, source: Source<S, keyof S>) => number;
export declare const getTargetIndex: <S extends Schema>(ref: CanvasRef<S>, target: Target<S, keyof S>) => number;
export declare function getSourcePosition<S extends Schema>(ref: CanvasRef<S>, source: Source<S, keyof S>): [number, number];
export declare function getTargetPosition<S extends Schema>(ref: CanvasRef<S>, target: Target<S, keyof S>): [number, number];
export declare const getPortOffsetY: (index: number) => number;
export declare type DropTarget<S extends Schema> = {
    x: number;
    y: number;
    target: Target<S, keyof S>;
};
export declare const getX: <S extends Schema>({ x }: DropTarget<S>) => number;
export declare const getY: <S extends Schema>({ y }: DropTarget<S>) => number;
export declare function getTargets<S extends Schema>(ref: CanvasRef<S>, sourceId: string): import("d3-quadtree").Quadtree<DropTarget<S>>;
export declare const snap: ([x, y]: [number, number], unit: number, [X, Y]: [number, number]) => Position;
export declare const defaultCanvasUnit = 52;
export declare const defaultCanvasDimensions: [number, number];
