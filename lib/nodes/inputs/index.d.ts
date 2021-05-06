import { EnterElement, Selection } from "d3-selection";
import type { Node, Schema, Target } from "../../interfaces.js";
export declare type Input<S extends Schema> = {
    index: number;
    target: Target<S, keyof S>;
    value: string | null;
};
export declare const getInputKey: <S extends Schema>({ target: { input }, }: Input<S>) => string;
export declare const appendInputPorts: <S extends Schema>(enter: Selection<EnterElement, Input<S>, SVGGElement, Node<S, keyof S>>) => Selection<SVGCircleElement, Input<S>, SVGGElement, Node<S, keyof S>>;
export declare const getInputs: <S extends Schema>(ref: any, node: Node<S, keyof S>) => Input<S>[];
