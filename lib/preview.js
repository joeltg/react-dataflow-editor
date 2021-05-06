import { portRadius, makeCurvePath } from "./utils.js";
export function updatePreview(preview, [x1, y1], [x2, y2], hover) {
    preview.select("path").attr("d", makeCurvePath([x1, y1], [x2, y2]));
    preview
        .select("circle.target")
        .attr("cx", x2)
        .attr("cy", y2)
        .attr("r", hover ? portRadius - 1.5 : portRadius);
}
export function startPreview(preview, [x1, y1], [x2, y2]) {
    preview.style("cursor", "grabbing");
    preview.classed("hidden", false);
    preview.select("circle.source").attr("cx", x1).attr("cy", y1);
    preview.select("path").attr("d", makeCurvePath([x1, y1], [x2, y2]));
    preview.select("circle.target").attr("cx", x2).attr("cy", y2);
}
export function stopPreview(preview) {
    preview.style("cursor", null);
    preview.classed("hidden", true);
    preview.select("path").attr("d", null);
    preview.select("circle").attr("cx", 0).attr("cy", 0);
}
export function attachPreview(preview) {
    preview.classed("hidden", true);
    preview.append("path").classed("curve", true);
    preview.append("circle").classed("source", true).attr("r", portRadius);
    preview.append("circle").classed("target", true).attr("r", portRadius);
}
