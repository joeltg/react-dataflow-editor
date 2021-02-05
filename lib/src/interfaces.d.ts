import React from "react";
import { Selection } from "d3-selection";
import { Dispatch } from "redux";
import { SystemAction } from "./redux/actions.js";
export declare const Factory: {
    block: <T extends {
        [x: string]: any;
    }>(block: Block<T>) => Block<T>;
};
export declare type GetValues<K extends string, S extends {
    [k in string]: Block<any>;
}> = {
    [k in K]: S[k] extends Block<infer T> ? T : never;
};
export declare type GetNode<K extends string, S extends {
    [k in K]: Block<any>;
}> = Node<K, GetValues<K, S>>;
export declare type Block<T extends {
    [k in string]: any;
}> = {
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
export declare type Values<K extends string> = {
    [k in K]: Record<string, any>;
};
export declare type Schema<K extends string, V extends Values<K>> = {
    [k in K]: Block<V[k]>;
};
export declare type Node<K extends string, V extends Values<K>> = {
    id: number;
    position: [number, number];
    inputs: Record<string, null | number>;
    outputs: Record<string, Set<number>>;
} & {
    [k in K]: {
        kind: k;
        value: V[k];
    };
}[K];
export declare type Port = [number, string];
export declare type Edge = {
    id: number;
    source: Port;
    target: Port;
};
export interface SystemState<K extends string, V extends Values<K>> {
    id: number;
    nodes: Map<number, Node<K, V>>;
    edges: Map<number, Edge>;
}
export declare const initialSystemState: <K extends string, V extends Values<K>>() => SystemState<K, V>;
export interface CanvasRef<K extends string, V extends Values<K>> {
    svg: Selection<SVGSVGElement | null, unknown, null, undefined>;
    contentDimensions: Map<number, [number, number]>;
    canvasDimensions: [number, number];
    nodes: SystemState<K, V>["nodes"];
    edges: SystemState<K, V>["edges"];
    unit: number;
    schema: Schema<K, V>;
    dimensions: [number, number];
    dispatch: Dispatch<SystemAction<K, V>>;
}
