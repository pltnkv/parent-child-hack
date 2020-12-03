define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // We should not know anything about canvasController or about CanvasEngine here
    // So all logic behind events processing placed in one place — EventHandler
    function registerEvents(eventsHandler, controller) {
        let shiftPressed = false;
        let metaPressed = false;
        let targetWidget;
        let movingWidgets = [];
        let doSelection;
        let moveCanvas;
        let mouseDownX;
        let mouseDownY;
        let mouseMoved = false;
        let callStartMoveNotSelectedWidget = false;
        let controlType;
        controller.canvasContainer.addEventListener('mousedown', (e) => {
            mouseDown = true;
            mouseDownX = e.clientX;
            mouseDownY = e.clientY;
            targetWidget = controller.findWidgetByElement(e.target);
            controlType = getControlType(e.target);
            movingWidgets = controller.getSelectedWidgets(true).map(w => ({ w: w, startAbsBounds: w.absoluteBounds }));
            if (controlType) {
                //не удалять а то doSelection = true отвалится
            }
            else if (targetWidget) {
                const targetWidgetInCurrentSelection = !!controller.getSelectedWidgets().some(w => w === targetWidget);
                if (!targetWidgetInCurrentSelection) {
                    movingWidgets = [{ w: targetWidget, startAbsBounds: targetWidget.absoluteBounds }];
                    callStartMoveNotSelectedWidget = true;
                }
            }
            else if (shiftPressed) {
                doSelection = true;
            }
            else {
                movingWidgets = controller.widgets
                    .filter(w => w.isAttachedToCanvas) //move only first-level widgets
                    .map(w => ({ w: w, startAbsBounds: w.absoluteBounds }));
                moveCanvas = true;
            }
            document.addEventListener('mousemove', onMouseMoveInner);
            document.addEventListener('mouseup', onMouseUp);
        });
        function onMouseMove(e) {
            if (mouseMoved || Math.abs(e.clientX - mouseDownX) > 2 || Math.abs(e.clientY - mouseDownY) > 2) {
                if (controlType) {
                    eventsHandler.onWidgetsResize(controlType, movingWidgets, e.clientX - mouseDownX, e.clientY - mouseDownY);
                }
                else if (targetWidget) {
                    if (!mouseMoved) {
                        if (callStartMoveNotSelectedWidget) {
                            eventsHandler.onStartMoveNotSelectedWidget();
                        }
                        eventsHandler.onWidgetsMoveStart(movingWidgets);
                    }
                    eventsHandler.onWidgetsMove(e.clientX - mouseDownX, e.clientY - mouseDownY, e.clientX, e.clientY);
                }
                else if (doSelection) {
                    const rect = {
                        x: mouseDownX,
                        y: mouseDownY,
                        width: e.clientX - mouseDownX,
                        height: e.clientY - mouseDownY,
                    };
                    if (rect.width < 0) {
                        rect.x += rect.width;
                        rect.width = -rect.width;
                    }
                    if (rect.height < 0) {
                        rect.y += rect.height;
                        rect.height = -rect.height;
                    }
                    eventsHandler.onSelectionChanged(rect);
                }
                else if (moveCanvas) {
                    eventsHandler.onCanvasMove(movingWidgets, e.clientX - mouseDownX, e.clientY - mouseDownY);
                }
                mouseMoved = true;
            }
        }
        function onMouseUp() {
            mouseDown = false;
            if (mouseMoved) {
                if (controlType) {
                    //on resize end
                }
                else if (targetWidget) {
                    eventsHandler.onWidgetsMoveEnd();
                }
                else if (doSelection) {
                    eventsHandler.onSelectionEnd();
                }
                else {
                }
            }
            else {
                if (targetWidget) {
                    if (shiftPressed) {
                        eventsHandler.onToggleSelection(targetWidget);
                    }
                    else {
                        eventsHandler.onWidgetClick(targetWidget);
                    }
                }
                else {
                    eventsHandler.onCanvasClick();
                }
            }
            targetWidget = undefined;
            doSelection = false;
            controlType = null;
            movingWidgets = [];
            moveCanvas = false;
            mouseMoved = false;
            callStartMoveNotSelectedWidget = false;
            document.removeEventListener('mousemove', onMouseMoveInner);
            document.removeEventListener('mouseup', onMouseUp);
        }
        ///////////////////////////////////////////////////////////////////////////
        // Keyboard events
        ///////////////////////////////////////////////////////////////////////////
        document.onkeydown = (e) => {
            if (document.activeElement !== document.body) {
                return;
            }
            if (e.key === 'Shift') {
                shiftPressed = true;
            }
            if (e.key === 'Meta') {
                metaPressed = true;
                e.preventDefault();
                e.stopPropagation();
            }
            if (e.key === 'd' && metaPressed) {
                eventsHandler.onDuplicate();
                e.preventDefault();
                e.stopPropagation();
            }
        };
        document.onkeyup = (e) => {
            if (document.activeElement !== document.body) {
                return;
            }
            if (e.key === 'Shift') {
                shiftPressed = false;
            }
            if (e.key === 'Meta') {
                shiftPressed = false;
            }
            if (e.key === 'Escape') {
                eventsHandler.onEsc();
            }
            if (e.key === 'Backspace') {
                eventsHandler.onDeleteSelectedWidgets();
            }
        };
        ///////////////////////////////////////////////////////////////////////////
        // Context menu
        ///////////////////////////////////////////////////////////////////////////
        controller.canvasContainer.addEventListener('contextmenu', e => {
            e.preventDefault();
        });
        ///////////////////////////////////////////////////////////////////////////
        // MouseMove optimization
        ///////////////////////////////////////////////////////////////////////////
        let mouseDown = false;
        let mouseMoveEvent;
        function onMouseMoveInner(e) {
            mouseMoveEvent = e;
        }
        requestAnimationFrame(onTick);
        function onTick() {
            if (mouseDown && mouseMoveEvent) {
                onMouseMove(mouseMoveEvent);
            }
            mouseMoveEvent = undefined;
            requestAnimationFrame(onTick);
        }
    }
    exports.default = registerEvents;
    function getControlType(element) {
        return element.getAttribute('control-type');
    }
});
