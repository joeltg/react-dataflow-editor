import { SystemState, Schema } from "../interfaces.js";
import { SystemAction } from "./actions.js";
export declare const rootReducer: <V extends Record<string, any>>(schema: Schema<V>, initialState?: SystemState<V>) => (state: SystemState<V> | undefined, action: SystemAction<V>) => SystemState<V>;
