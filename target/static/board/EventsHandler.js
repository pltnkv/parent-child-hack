define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class EventsHandler {
        constructor(controller) {
            this.controller = controller;
        }
        onWidgetMove(target, newX, newY) {
            this.controller.moveWidget(target, newX, newY);
        }
        onWidgetClick(target) {
            if (this.controller.getSelectedWidget() === target) {
                this.controller.selectWidget(target);
            }
            // if (this.controller.getSelectedWidget() === targetPrimitive.parentWidget.state.id && targetPrimitive.onClick) {
            //fire click event on target primitive (only if widget selected)
            // targetPrimitive.onClick()
            // } else {
            // 	this.controller.selectWidget(targetPrimitive.parentWidget.state.id)
            // }
        }
        onCanvasClick() {
            this.controller.unselectWidget();
        }
    }
    exports.default = EventsHandler;
});
