define(["require", "exports", "canvas/widgets/BaseWidget"], function (require, exports, BaseWidget_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ShapeWidget extends BaseWidget_1.default {
        constructor(controller, initData) {
            const div = document.createElement('div');
            div.style.top = initData.y + 'px';
            div.style.left = initData.x + 'px';
            div.style.width = initData.width + 'px';
            div.style.height = initData.height + 'px';
            div.style.backgroundColor = initData.color;
            div.setAttribute('data-id', 'true');
            super(controller, div, initData);
        }
    }
    exports.default = ShapeWidget;
});
