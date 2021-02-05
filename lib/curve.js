"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeCurvePath = void 0;
const minCurveExtent = 104;
function makeCurvePath([x1, y1], [x2, y2]) {
    const dx = x2 - x1;
    const mx = x1 + dx / 2;
    const dy = y2 - y1;
    const my = y1 + dy / 2;
    const qx = x1 + Math.max(Math.min(minCurveExtent, Math.abs(dy / 2)), dx / 4);
    return `M ${x1} ${y1} Q ${qx} ${y1} ${mx} ${my} T ${x2} ${y2}`;
}
exports.makeCurvePath = makeCurvePath;
//# sourceMappingURL=curve.js.map