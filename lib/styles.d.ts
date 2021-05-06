import React from "react";
import type { Kinds, Schema } from "./state.js";
import type { EditorContext } from "./context.js";
export declare const defaultBackgroundColor = "lightgray";
export declare const borderColor = "dimgray";
export declare const defaultNodeHeaderStyle: React.CSSProperties;
export declare type getEditorStyle = (context: EditorContext) => React.CSSProperties;
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
