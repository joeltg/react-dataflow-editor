import React from "react";
import { Blocks, Node, Schema } from "./interfaces.js";
export declare const defaultBackgroundColor = "lightgray";
export declare const defaultBorderColor = "dimgray";
export declare const getBackgroundColor: <S extends Schema>(blocks: Blocks<S>) => ({ kind, }: Node<S, keyof S>) => string;
export declare const defaultBlockHeaderStyle: React.CSSProperties;
export declare type getEditorStyle = (ref: {
    unit: number;
    height: number;
}) => React.CSSProperties;
export declare type getBlockStyle = <S extends Schema>(block: Blocks<S>[keyof S]) => React.CSSProperties;
interface StyleContext {
    getCanvasStyle: getEditorStyle;
    getSVGStyle: getEditorStyle;
    getBlockHeaderStyle: getBlockStyle;
    getBlockContentStyle: getBlockStyle;
}
export declare const defaultCanvasStyle: React.CSSProperties;
export declare const defaultStyleContext: StyleContext;
export declare const StyleContext: React.Context<StyleContext>;
export {};
