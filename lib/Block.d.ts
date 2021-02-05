/// <reference types="react" />
import { Schema, Values } from "./interfaces.js";
export interface BlockContentProps<V extends Values> {
    id: number;
    schema: Schema<V>;
}
export declare function BlockContent<V extends Values>({ id, schema, }: BlockContentProps<V>): JSX.Element | null;
