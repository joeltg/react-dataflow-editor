/// <reference types="react" />
import * as actions from "./redux/actions.js";
import { Graph, Blocks, Schema } from "./interfaces.js";
export interface CanvasProps<S extends Schema> {
    unit: number;
    height: number;
    blocks: Blocks<S>;
    graph: Graph<S>;
    onFocus?: (id: string | null) => void;
    dispatch: (action: actions.EditorAction<S>) => void;
}
export declare function Canvas<S extends Schema>(props: CanvasProps<S>): JSX.Element;
