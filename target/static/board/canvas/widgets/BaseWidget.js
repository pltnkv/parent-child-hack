define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class BaseWidget {
        constructor(parent, element) {
            this.parentDiv = parent;
            this.element = element;
        }
        get x() {
            return this.element.clientLeft;
        }
        get y() {
            return this.element.clientTop;
        }
        destroy() {
            this.element.remove();
        }
    }
    exports.default = BaseWidget;
});
