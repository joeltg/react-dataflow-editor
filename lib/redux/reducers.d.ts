import { SystemState, Blocks } from "../interfaces.js";
import { SystemAction } from "./actions.js";
export declare const rootReducer: <S extends Record<string, {
    value: any;
    inputs: string;
    outputs: string;
}>>(blocks: Blocks<S>, initialState?: SystemState<S>) => (state: SystemState<S> | undefined, action: SystemAction<S>) => SystemState<S>;
