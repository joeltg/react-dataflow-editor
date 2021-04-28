import React from "react";
import type { Kinds, Node, Schema } from "./interfaces.js";
export declare const defaultBackgroundColor = "lightgray";
export declare const defaultBorderColor = "dimgray";
export declare const getBackgroundColor: <S extends Schema>(kinds: Kinds<S>) => (node: Node<S, keyof S>) => string;
export declare const defaultNodeHeaderStyle: React.CSSProperties;
export declare type getEditorStyle = (ref: {
    unit: number;
    height: number;
}) => React.CSSProperties;
export declare type getNodeStyle = <S extends Schema>(kinds: Kinds<S>, kind: keyof S) => React.CSSProperties;
interface StyleContext {
    getCanvasStyle: getEditorStyle;
    getSVGStyle: getEditorStyle;
    getNodeHeaderStyle: getNodeStyle;
    getNodeContentStyle: getNodeStyle;
}
export declare const defaultCanvasStyle: React.CSSProperties;
export declare const defaultStyleContext: StyleContext;
export declare const StyleContext: React.Context<StyleContext>;
export {};
