/// <reference types="react" />
import { Block, Edge, GetNode, GetValues, Schema, SystemState } from "./interfaces.js";
export interface EditorProps<K extends string, S extends {
    [k in K]: Block<any>;
}> {
    unit?: number;
    dimensions: [number, number];
    schema: Schema<K, GetValues<K, S>>;
    initialState?: SystemState<K, GetValues<K, S>>;
    onChange: (nodes: Map<number, GetNode<K, S>>, edges: Map<number, Edge>) => void;
}
export declare function Editor<K extends string, S extends {
    [k in K]: Block<any>;
}>({ unit, dimensions, schema, initialState, onChange, }: EditorProps<K, S>): JSX.Element;
