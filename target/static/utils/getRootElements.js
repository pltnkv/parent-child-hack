define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function getRootWidgets(widgets) {
        const containers = widgets.filter(w => w.isContainer);
        return widgets.filter(widget => {
            return !containers.some(cont => cont.contains(widget));
        });
    }
    exports.default = getRootWidgets;
});
