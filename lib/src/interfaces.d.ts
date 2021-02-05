import React from "react";
import { Selection } from "d3-selection";
import { Dispatch } from "redux";
import { SystemAction } from "./redux/actions.js";
export declare const Factory: {
    block: <T, I extends readonly string[], O extends readonly string[]>(block: Block<T, I, O>) => Block<T, I, O>;
    blocks: <B extends Blocks<Record<string, {
        value: any;
        inputs: readonly string[];
        outputs: readonly string[];
    }>>>(blocks: B) => Blocks<GetSchema<B>>;
};
export declare type Block<T, I extends readonly string[], O extends readonly string[]> = {
    name: string;
    inputs: I;
    outputs: O;
    initialValue: T;
    backgroundColor: string;
    component: React.FC<{
        value: T;
        setValue(value: T): void;
    }>;
};
export declare type Schema = Record<string, {
    value: any;
    inputs: readonly string[];
    outputs: readonly string[];
}>;
export declare type GetValue<S extends Schema, K extends keyof S> = S[K]["value"];
export declare type GetInputs<S extends Schema, K extends keyof S> = S[K]["inputs"];
export declare type GetOutputs<S extends Schema, K extends keyof S> = S[K]["outputs"];
export declare function forInputs<S extends Schema, K extends keyof S>(blocks: Blocks<S>, kind: keyof S): Generator<[number, GetInputs<S, K>[number]]>;
export declare function forOutputs<S extends Schema, K extends keyof S>(blocks: Blocks<S>, kind: keyof S): Generator<[number, GetOutputs<S, K>[number]]>;
export declare type Blocks<S extends Schema> = {
    [k in keyof S]: Block<GetValue<S, k>, GetInputs<S, k>, GetOutputs<S, k>>;
};
export declare type GetSchema<B extends Blocks<Schema>> = {
    [k in keyof B]: B[k] extends Block<infer T, infer I, infer O> ? {
        value: T;
        inputs: I;
        outputs: O;
    } : never;
};
export declare type Node<S extends Schema> = {
    id: number;
    position: [number, number];
} & {
    [k in keyof S]: {
        kind: k;
        value: GetValue<S, k>;
        inputs: {
            [input in GetInputs<S, k>[number]]: null | number;
        };
        outputs: {
            [output in GetOutputs<S, k>[number]]: Set<number>;
        };
    };
}[keyof S];
export declare type Source<S extends Schema, K extends keyof S> = [
    number,
    GetOutputs<S, K>[number]
];
export declare type Target<S extends Schema, K extends keyof S> = [
    number,
    GetInputs<S, K>[number]
];
export declare type Edge<S extends Schema, SK extends keyof S = keyof S, TK extends keyof S = keyof S> = {
    id: number;
    source: Source<S, SK>;
    target: Target<S, TK>;
};
export interface SystemState<S extends Schema> {
    id: number;
    nodes: Map<number, Node<S>>;
    edges: Map<number, Edge<S, keyof S, keyof S>>;
}
export declare const initialSystemState: <S extends Record<string, {
    value: any;
    inputs: readonly string[];
    outputs: readonly string[];
}>>() => SystemState<S>;
export interface CanvasRef<S extends Schema> {
    svg: Selection<SVGSVGElement | null, unknown, null, undefined>;
    contentDimensions: Map<number, [number, number]>;
    canvasDimensions: [number, number];
    nodes: SystemState<S>["nodes"];
    edges: SystemState<S>["edges"];
    unit: number;
    blocks: Blocks<S>;
    dimensions: [number, number];
    dispatch: Dispatch<SystemAction<S>>;
}
