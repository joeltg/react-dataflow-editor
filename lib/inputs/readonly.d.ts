import type { ReadonlyCanvasRef, Schema } from "../interfaces.js";
import { AttachPorts } from "../utils.js";
export declare const updateInputPorts: <S extends Schema>(ref: ReadonlyCanvasRef<S>) => AttachPorts<S>;
