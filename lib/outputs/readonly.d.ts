import { ReadonlyCanvasRef, Schema } from "../interfaces.js";
import { AttachPorts } from "../utils.js";
export declare const updateOutputPorts: <S extends Schema>(ref: ReadonlyCanvasRef<S>) => AttachPorts<S>;
