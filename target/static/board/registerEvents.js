define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // We should not know anything about canvasController or about CanvasEngine here
    // So all logic behind events processing placed in one place — EventHandler
    function registerEvents(eventsHandler, controller) {
        let targetWidget;
        let widgetStartX;
        let widgetStartY;
        let mouseDownX;
        let mouseDownY;
        let mouseMoved = false;
        controller.canvasContainer.addEventListener('mousedown', (e) => {
            mouseDownX = e.clientX;
            mouseDownY = e.clientY;
            targetWidget = controller.findWidgetByElement(e.target);
            if (targetWidget) {
                widgetStartX = targetWidget.x;
                widgetStartY = targetWidget.y;
            }
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
        function onMouseMove(e) {
            if (mouseMoved || Math.abs(e.clientX - mouseDownX) > 2 || Math.abs(e.clientY - mouseDownY) > 2) {
                mouseMoved = true;
                if (targetWidget) {
                    const newX = widgetStartX + e.clientX - mouseDownX;
                    const newY = widgetStartY + e.clientY - mouseDownY;
                    eventsHandler.onWidgetsMove(targetWidget, newX, newY);
                }
            }
        }
        function onMouseUp() {
            if (!mouseMoved) {
                if (targetWidget) {
                    eventsHandler.onWidgetClick(targetWidget);
                }
                else {
                    eventsHandler.onCanvasClick();
                }
            }
            targetWidget = undefined;
            mouseMoved = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }
    }
    exports.default = registerEvents;
});
