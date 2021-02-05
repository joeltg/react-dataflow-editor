import React from "react";
import { Selection } from "d3-selection";
import { Dispatch } from "redux";
import { SystemAction } from "./redux/actions.js";
export declare const Factory: {
    block: <T>(block: Block<T>) => Block<T>;
    schema: <S extends Record<string, Block<any>>>(schema: S) => Schema<{ [k in keyof S]: S[k] extends Block<infer T_1> ? T_1 : never; }>;
};
export declare type Block<T> = {
    name: string;
    inputs: string[];
    outputs: string[];
    initialValue: T;
    backgroundColor: string;
    component: React.FC<{
        value: T;
        setValue(value: T): void;
    }>;
};
export declare type Values = Record<string, any>;
export declare type Schema<V extends Values> = {
    [k in keyof V]: Block<V[k]>;
};
export declare type Node<V extends Values> = {
    id: number;
    position: [number, number];
    inputs: Record<string, null | number>;
    outputs: Record<string, Set<number>>;
} & {
    [k in keyof V]: {
        kind: k;
        value: V[k];
    };
}[keyof V];
export declare type Port = [number, string];
export declare type Edge = {
    id: number;
    source: Port;
    target: Port;
};
export interface SystemState<V extends Values> {
    id: number;
    nodes: Map<number, Node<V>>;
    edges: Map<number, Edge>;
}
export declare const initialSystemState: <V extends Record<string, any>>() => SystemState<V>;
export interface CanvasRef<V extends Values> {
    svg: Selection<SVGSVGElement | null, unknown, null, undefined>;
    contentDimensions: Map<number, [number, number]>;
    canvasDimensions: [number, number];
    nodes: SystemState<V>["nodes"];
    edges: SystemState<V>["edges"];
    unit: number;
    schema: Schema<V>;
    dimensions: [number, number];
    dispatch: Dispatch<SystemAction<V>>;
}
