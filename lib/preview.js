"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachPreview = exports.stopPreview = exports.startPreview = exports.updatePreview = void 0;
const curve_js_1 = require("./curve.js");
const utils_js_1 = require("./utils.js");
function updatePreview(preview, [x1, y1], [x2, y2], hover) {
    preview.select("path").attr("d", curve_js_1.makeCurvePath([x1, y1], [x2, y2]));
    preview
        .select("circle.target")
        .attr("cx", x2)
        .attr("cy", y2)
        .attr("r", hover ? utils_js_1.portRadius - 1.5 : utils_js_1.portRadius);
}
exports.updatePreview = updatePreview;
function startPreview(preview, [x1, y1], [x2, y2]) {
    preview.classed("hidden", false);
    preview.select("circle.source").attr("cx", x1).attr("cy", y1);
    preview.select("path").attr("d", curve_js_1.makeCurvePath([x1, y1], [x2, y2]));
    preview.select("circle.target").attr("cx", x2).attr("cy", y2);
}
exports.startPreview = startPreview;
function stopPreview(preview) {
    preview.classed("hidden", true);
    preview.select("path").attr("d", null);
    preview.select("circle").attr("cx", 0).attr("cy", 0);
}
exports.stopPreview = stopPreview;
function attachPreview(preview) {
    preview.classed("hidden", true);
    preview.append("path").classed("curve", true);
    preview.append("circle").classed("source", true).attr("r", utils_js_1.portRadius);
    preview.append("circle").classed("target", true).attr("r", utils_js_1.portRadius);
}
exports.attachPreview = attachPreview;
