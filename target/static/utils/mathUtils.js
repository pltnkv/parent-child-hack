define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isPointIntersectsBounds = exports.isBoundsIntersect = exports.offsetToBounds = exports.rectToBounds = void 0;
    function rectToBounds(rect) {
        return Object.assign(Object.assign({}, rect), { top: rect.y, left: rect.x, bottom: rect.y + rect.height, right: rect.x + rect.width });
    }
    exports.rectToBounds = rectToBounds;
    function offsetToBounds(offset) {
        return Object.assign(Object.assign({}, offset), { x: offset.left, y: offset.top, height: offset.bottom - offset.top, width: offset.right - offset.left });
    }
    exports.offsetToBounds = offsetToBounds;
    function isBoundsIntersect(r1, r2) {
        return !(r2.left > r1.right ||
            r2.right < r1.left ||
            r2.top > r1.bottom ||
            r2.bottom < r1.top);
    }
    exports.isBoundsIntersect = isBoundsIntersect;
    function isPointIntersectsBounds(point, bounds) {
        return point.x > bounds.left && point.x < bounds.right && point.y > bounds.top && point.y < bounds.bottom;
    }
    exports.isPointIntersectsBounds = isPointIntersectsBounds;
});
