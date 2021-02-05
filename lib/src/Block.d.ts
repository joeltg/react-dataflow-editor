/// <reference types="react" />
import { Schema, Values } from "./interfaces.js";
export interface BlockContentProps<K extends string, V extends Values<K>> {
    id: number;
    schema: Schema<K, V>;
}
export declare function BlockContent<K extends string, V extends Values<K>>({ id, schema, }: BlockContentProps<K, V>): JSX.Element | null;
