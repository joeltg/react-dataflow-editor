import { Selection } from "d3-selection";
export declare function updatePreview(preview: Selection<SVGGElement | null, unknown, null, undefined>, [x1, y1]: [number, number], [x2, y2]: [number, number], hover: boolean): void;
export declare function startPreview(preview: Selection<SVGGElement | null, unknown, null, undefined>, [x1, y1]: [number, number], [x2, y2]: [number, number]): void;
export declare function stopPreview(preview: Selection<SVGGElement | null, unknown, null, undefined>): void;
export declare function attachPreview(preview: Selection<SVGGElement | null, unknown, null, undefined>): void;
