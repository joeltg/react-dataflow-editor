import React from "react";
import { Blocks, Schema } from "./interfaces.js";
export declare const defaultBlockHeaderStyle: React.CSSProperties;
export declare type getBlockHeaderStyle = <S extends Schema>(block: Blocks<S>[keyof S]) => React.CSSProperties;
interface StyleContext {
    getBlockHeaderStyle: getBlockHeaderStyle;
}
export declare const defaultStyleContext: StyleContext;
export declare const StyleContext: React.Context<StyleContext>;
export {};
