import type { CanvasRef, Schema } from "../interfaces.js";
import { AttachPorts } from "../utils.js";
export declare function updateOutputPorts<S extends Schema>(ref: CanvasRef<S>): AttachPorts<S>;
