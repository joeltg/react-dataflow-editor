/// <reference types="react" />
import { CanvasRef, Edge, Schema, Target, Position } from "./interfaces";
export declare const portRadius = 12;
export declare const portMargin = 12;
export declare const portHeight: number;
export declare function makeClipPath(inputCount: number, [width, height]: [number, number]): string;
export declare const minWidth: number;
export declare const minHeight: number;
export declare const getKey: ({ id }: {
    id: number;
}) => string;
export declare const toTranslate: (x: number, y: number) => string;
export declare function getSourcePosition<S extends Schema>(ref: CanvasRef<S>, { source: { id, output } }: Edge<S>): [number, number];
export declare function getTargetPosition<S extends Schema>(ref: CanvasRef<S>, { target: { id, input } }: Edge<S>): [number, number];
export declare const getPortOffsetY: (index: number) => number;
export declare type DropTarget<S extends Schema> = {
    x: number;
    y: number;
    target: Target<S, keyof S>;
};
export declare const getX: <S extends Record<string, {
    value: any;
    inputs: string;
    outputs: string;
}>>({ x }: DropTarget<S>) => number;
export declare const getY: <S extends Record<string, {
    value: any;
    inputs: string;
    outputs: string;
}>>({ y }: DropTarget<S>) => number;
export declare function getTargets<S extends Schema>(ref: CanvasRef<S>, sourceId: number): import("d3-quadtree").Quadtree<DropTarget<S>>;
export declare const snap: ([x, y]: [number, number], unit: number, [X, Y]: [number, number]) => Position;
export declare const defaultCanvasUnit = 72;
export interface EditorContextValue {
    unit: number;
    dimensions: [number, number];
}
export declare const EditorContext: import("react").Context<EditorContextValue>;
