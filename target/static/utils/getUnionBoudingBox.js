define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function createElement(rects) {
        const res = { x: Number.MAX_VALUE, y: Number.MAX_VALUE, width: 0, height: 0 };
        rects.forEach(r => {
            if (r.x < res.x) {
                res.x = r.x;
            }
            if (r.y < res.y) {
                res.y = r.y;
            }
            if (r.width > res.width) {
                res.width = r.width;
            }
            if (r.height > res.height) {
                res.height = r.height;
            }
        });
        return res;
    }
    exports.default = createElement;
});
