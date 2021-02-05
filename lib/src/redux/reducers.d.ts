import { SystemState, Schema, Values } from "../interfaces.js";
import { SystemAction } from "./actions.js";
export declare const rootReducer: <K extends string, V extends Values<K>>(schema: Schema<K, V>, initialState?: SystemState<K, V>) => (state: SystemState<K, V> | undefined, action: SystemAction<K, V>) => SystemState<K, V>;
