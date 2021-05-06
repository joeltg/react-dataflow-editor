import { Selection, EnterElement } from "d3-selection";
import type { Schema, Node } from "../interfaces.js";
import { AttachPorts } from "../utils.js";
export declare const appendNodes: <S extends Schema>(ref: any, enter: Selection<EnterElement, Node<S, keyof S>, SVGGElement | null, unknown>, attachInputs: AttachPorts<S>, attachOutputs: AttachPorts<S>) => Selection<SVGGElement, Node<S, keyof S>, SVGGElement | null, unknown>;
