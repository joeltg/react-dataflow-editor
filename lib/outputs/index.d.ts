import { EnterElement, Selection } from "d3-selection";
import type { Schema, Node, Source, ReadonlyCanvasRef, GetOutputs } from "../interfaces.js";
export declare type Output<S extends Schema> = {
    index: number;
    source: Source<S, keyof S>;
    value: string[];
};
export declare const getOutputKey: <S extends Schema>({ source: { output }, }: Output<S>) => string;
export declare const appendOutputPorts: <S extends Schema>(enter: Selection<EnterElement, Output<S>, SVGGElement, Node<S, keyof S>>) => Selection<SVGCircleElement, Output<S>, SVGGElement, Node<S, keyof S>>;
export declare const getOutputs: <S extends Schema>(ref: ReadonlyCanvasRef<S>, node: Node<S, keyof S>) => {
    index: number;
    source: {
        id: string;
        output: GetOutputs<S, keyof S>;
    };
    value: Record<GetOutputs<S, keyof S>, string[]>[GetOutputs<S, keyof S>];
}[];
