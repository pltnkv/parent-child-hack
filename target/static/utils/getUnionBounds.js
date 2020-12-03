define(["require", "exports", "utils/mathUtils"], function (require, exports, mathUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function getUnionBounds(bounds) {
        const res = { left: Number.MAX_VALUE, top: Number.MAX_VALUE, bottom: Number.MIN_VALUE, right: Number.MIN_VALUE };
        bounds.forEach(r => {
            if (r.left < res.left) {
                res.left = r.left;
            }
            if (r.top < res.top) {
                res.top = r.top;
            }
            if (r.right > res.right) {
                res.right = r.right;
            }
            if (r.bottom > res.bottom) {
                res.bottom = r.bottom;
            }
        });
        return mathUtils_1.offsetToBounds(res);
    }
    exports.default = getUnionBounds;
});
