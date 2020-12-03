define(["require", "exports", "utils/mathUtils"], function (require, exports, mathUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function getIntersectedWidgets(absBounds, widgets) {
        return widgets.filter(w => {
            return mathUtils_1.isBoundsIntersect(w.absoluteBounds, absBounds);
        });
    }
    exports.default = getIntersectedWidgets;
});
