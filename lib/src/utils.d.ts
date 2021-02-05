import { CanvasRef, Edge, Node, Port, Schema, Values } from "./interfaces";
export declare const portRadius = 12;
export declare const portMargin = 12;
export declare const portHeight: number;
export declare function makeClipPath(inputCount: number, [width, height]: [number, number]): string;
export declare const defaultCanvasUnit = 72;
export declare const defaultBackgroundColor = "lightgray";
export declare const defaultBorderColor = "dimgray";
export declare const minWidth: number;
export declare const minHeight: number;
export declare const getKey: ({ id }: {
    id: number;
}) => string;
export declare const toTranslate: (x: number, y: number) => string;
export declare const positionEqual: ([x1, y1]: [number, number], [x2, y2]: [number, number]) => boolean;
export declare function getSourcePosition<K extends string, V extends Values<K>>(ref: CanvasRef<K, V>, { source: [id, output] }: Edge): [number, number];
export declare function getTargetPosition<K extends string, V extends Values<K>>(ref: CanvasRef<K, V>, { target: [id, input] }: Edge): [number, number];
export declare const getPortOffsetY: (index: number) => number;
export declare const getBackgroundColor: <K extends string, V extends Values<K>>(schema: Schema<K, V>) => ({ kind }: Node<K, V>) => string;
export declare type Target = {
    x: number;
    y: number;
    target: Port;
};
export declare const getX: ({ x }: Target) => number;
export declare const getY: ({ y }: Target) => number;
export declare function getTargets<K extends string, V extends Values<K>>(ref: CanvasRef<K, V>, sourceId: number): import("d3-quadtree").Quadtree<Target>;
export declare const snap: ([x, y]: [number, number], unit: number, [X, Y]: [number, number]) => [number, number];
