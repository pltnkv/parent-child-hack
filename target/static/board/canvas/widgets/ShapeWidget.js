define(["require", "exports", "board/canvas/widgets/BaseWidget"], function (require, exports, BaseWidget_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ShapeWidget extends BaseWidget_1.default {
        constructor(parent, initData) {
            const div = document.createElement('div');
            div.style.position = 'absolute';
            div.style.top = initData.y + 'px';
            div.style.left = initData.x + 'px';
            div.style.width = initData.width + 'px';
            div.style.height = initData.height + 'px';
            div.style.backgroundColor = initData.color;
            div.dataset.id = initData.color;
            parent.appendChild(div);
            super(parent, div);
        }
    }
    exports.default = ShapeWidget;
});
