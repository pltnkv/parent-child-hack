define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function createElement(styles) {
        const div = document.createElement('div');
        for (let p in styles) {
            div.style[p] = styles[p];
        }
        return div;
    }
    exports.default = createElement;
});
