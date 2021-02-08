import React from "react";
import { Blocks, Node, Schema } from "./interfaces.js";
export declare const defaultBackgroundColor = "lightgray";
export declare const defaultBorderColor = "dimgray";
export declare const getBackgroundColor: <S extends Record<string, {
    value: any;
    inputs: string;
    outputs: string;
}>>(blocks: Blocks<S>) => ({ kind, }: Node<S, keyof S>) => string;
export declare const defaultBlockHeaderStyle: React.CSSProperties;
export declare type getBlockStyle = <S extends Schema>(block: Blocks<S>[keyof S]) => React.CSSProperties;
interface StyleContext {
    getBlockHeaderStyle: getBlockStyle;
    getBlockContainerStyle: getBlockStyle;
}
export declare const defaultStyleContext: StyleContext;
export declare const StyleContext: React.Context<StyleContext>;
export {};
