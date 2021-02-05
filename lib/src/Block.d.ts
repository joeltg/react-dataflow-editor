/// <reference types="react" />
import { Blocks, Schema } from "./interfaces.js";
export interface BlockContentProps<S extends Schema> {
    id: number;
    blocks: Blocks<S>;
}
export declare function BlockContent<S extends Schema>({ id, blocks, }: BlockContentProps<S>): JSX.Element | null;
