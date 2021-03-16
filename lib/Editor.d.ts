/// <reference types="react" />
import { Blocks, Graph, Schema } from "./interfaces.js";
import { EditorAction } from "./redux/actions.js";
export interface EditorProps<S extends Schema> {
    unit?: number;
    height?: number;
    blocks: Blocks<S>;
    graph: Graph<S>;
    dispatch: (action: EditorAction<S>) => void;
    onFocus?: (id: string | null) => void;
}
export declare function Editor<S extends Schema>({ unit, height, ...props }: EditorProps<S>): JSX.Element;
