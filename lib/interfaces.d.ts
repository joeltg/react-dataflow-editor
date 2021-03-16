import { Selection } from "d3-selection";
import { EditorAction } from "./redux/actions.js";
export declare type Position = {
    x: number;
    y: number;
};
export declare const Factory: {
    block: <I extends string, O extends string>(block: Block<I, O>) => Block<I, O>;
    blocks: <B extends Blocks<Schema>>(blocks: B) => Blocks<GetSchema<B>>;
};
export declare type Block<I extends string, O extends string> = {
    name: string;
    inputs: {
        [i in I]: null;
    };
    outputs: {
        [o in O]: null;
    };
    backgroundColor: string;
};
export declare type Schema = Record<string, {
    inputs: string;
    outputs: string;
}>;
export declare type GetInputs<S extends Schema, K extends keyof S> = S[K]["inputs"];
export declare type GetOutputs<S extends Schema, K extends keyof S> = S[K]["outputs"];
export declare type Blocks<S extends Schema> = {
    [k in keyof S]: Block<GetInputs<S, k>, GetOutputs<S, k>>;
};
export declare type GetSchema<B extends Blocks<Schema>> = {
    [k in keyof B]: B[k] extends Block<infer I, infer O> ? {
        inputs: I;
        outputs: O;
    } : never;
};
declare type NodeIndex<S extends Schema> = {
    [k in keyof S]: {
        id: string;
        position: Position;
        kind: k;
        inputs: Record<GetInputs<S, k>, null | string>;
        outputs: Record<GetOutputs<S, k>, Set<string>>;
    };
};
export declare type Node<S extends Schema, K extends keyof S = keyof S> = NodeIndex<S>[K];
export declare type Source<S extends Schema, K extends keyof S> = {
    id: string;
    output: GetOutputs<S, K>;
};
export declare type Target<S extends Schema, K extends keyof S> = {
    id: string;
    input: GetInputs<S, K>;
};
export declare type Edge<S extends Schema, SK extends keyof S = keyof S, TK extends keyof S = keyof S> = {
    id: string;
    source: Source<S, SK>;
    target: Target<S, TK>;
};
export declare type Graph<S extends Schema> = {
    nodes: Record<string, Node<S>>;
    edges: Record<string, Edge<S>>;
};
export declare const initialEditorState: <S extends Schema>() => Graph<S>;
export interface ReadonlyCanvasRef<S extends Schema> {
    graph: Graph<S>;
    nodes: Selection<SVGGElement | null, unknown, null, undefined>;
    edges: Selection<SVGGElement | null, unknown, null, undefined>;
    unit: number;
    height: number;
    blocks: Blocks<S>;
}
export interface CanvasRef<S extends Schema> extends ReadonlyCanvasRef<S> {
    preview: Selection<SVGGElement | null, unknown, null, undefined>;
    dispatch: (action: EditorAction<S>) => void;
}
export {};
