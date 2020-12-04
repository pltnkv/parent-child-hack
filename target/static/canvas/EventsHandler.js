define(["require", "exports", "utils/getIntersectedWidgets", "utils/mathUtils", "types/ControlType"], function (require, exports, getIntersectedWidgets_1, mathUtils_1, ControlType_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class EventsHandler {
        constructor(controller) {
            this.controller = controller;
            this.movingWidgets = [];
        }
        onWidgetsMoveStart(movingWidgets) {
            let movingWidgetsForReal = [];
            movingWidgets.forEach(mw => {
                const parentWidget = mw.w.parentWidget;
                if (parentWidget) {
                    if (parentWidget.isDADEnabled) {
                        const absBounds = mw.w.absoluteBounds;
                        mw.w.x = absBounds.x;
                        mw.w.y = absBounds.y;
                        this.controller.appendToCanvas(mw.w);
                    }
                    else {
                        return;
                    }
                }
                movingWidgetsForReal.push(mw);
            });
            this.movingWidgets = movingWidgetsForReal;
        }
        onWidgetsMove(deltaX, deltaY, mouseX, mouseY) {
            if (this.movingWidgets.length === 0) {
                return;
            }
            const targetContainer = this.controller.findTargetContainer({ x: mouseX, y: mouseY }, this.movingWidgets);
            if (this.prevTargetContainer && this.prevTargetContainer !== targetContainer) {
                this.prevTargetContainer.removeGhosts();
            }
            if (targetContainer) {
                if (targetContainer !== this.prevTargetContainer) {
                    targetContainer.addGhosts(this.movingWidgets);
                }
                targetContainer.updateGhosts(mouseX, mouseY);
            }
            this.prevTargetContainer = targetContainer;
            this.moveWidgets(this.movingWidgets, deltaX, deltaY);
        }
        onWidgetsMoveEnd() {
            if (this.prevTargetContainer) {
                this.prevTargetContainer.applyGhosts();
                this.prevTargetContainer = undefined;
            }
        }
        moveWidgets(movingWidgets, deltaX, deltaY) {
            movingWidgets.forEach((mw) => {
                const newX = mw.startAbsBounds.x + deltaX;
                const newY = mw.startAbsBounds.y + deltaY;
                this.controller.moveWidget(mw.w, newX, newY);
            });
        }
        onStartMoveNotSelectedWidget() {
            this.controller.unselectWidget();
        }
        onCanvasMove(movingWidgets, deltaX, deltaY) {
            // this.controller.unselectWidget()
            this.moveWidgets(movingWidgets, deltaX, deltaY);
        }
        onWidgetsResize(controlType, movingWidgets, deltaX, deltaY) {
            //todo не сможем ресайзится в родителе
            if (controlType === ControlType_1.default.Top) {
                movingWidgets.forEach(mw => {
                    doResize(mw.startAbsBounds.height - deltaY, height => {
                        mw.w.height = height;
                        if (!mw.w.isPositionControlledByParent) {
                            mw.w.y = mw.startAbsBounds.y + deltaY;
                        }
                    });
                });
            }
            else if (controlType === ControlType_1.default.Bottom) {
                movingWidgets.forEach(mw => {
                    doResize(mw.startAbsBounds.height + deltaY, height => mw.w.height = height);
                });
            }
            else if (controlType === ControlType_1.default.Left) {
                movingWidgets.forEach(mw => {
                    doResize(mw.startAbsBounds.width - deltaX, width => {
                        mw.w.width = width;
                        if (!mw.w.isPositionControlledByParent) {
                            mw.w.x = mw.startAbsBounds.x + deltaX;
                        }
                    });
                });
            }
            else { //ControlType.Right
                movingWidgets.forEach(mw => {
                    doResize(mw.startAbsBounds.width + deltaX, width => mw.w.width = width);
                });
            }
        }
        onSelectionChanged(rect) {
            const selectionBounds = mathUtils_1.rectToBounds(rect);
            this.controller.controlsLayer.drawSelectionArea(selectionBounds);
            this.controller.selectWidgets(getIntersectedWidgets_1.default(selectionBounds, this.controller.widgets));
        }
        onSelectionEnd() {
            this.controller.controlsLayer.hideSelectionArea();
        }
        onWidgetClick(target) {
            //get default behavior from widget
            this.controller.selectWidgets([target]);
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
        onToggleSelection(target) {
            let selectedWidgets = this.controller.getSelectedWidgets();
            if (selectedWidgets.indexOf(target) !== -1) {
                selectedWidgets = selectedWidgets.filter(sw => sw !== target);
            }
            else {
                selectedWidgets.push(target);
            }
            this.controller.selectWidgets(selectedWidgets);
        }
        ////////////////////////////////////////
        // keyboard
        onEsc() {
            this.controller.unselectWidget();
        }
        onDuplicate() {
            const duplicatedWidgets = [];
            this.controller.getSelectedWidgets(true).forEach(selectedWidget => {
                const wrap = document.createElement('div');
                wrap.appendChild(selectedWidget.element.cloneNode(true));
                const newWidgets = this.controller.createWidgetFromHTML(wrap.innerHTML);
                newWidgets.forEach(nw => {
                    this.controller.appendToCanvas(nw);
                    nw.x += 10;
                    nw.y += 10;
                });
                duplicatedWidgets.push(...newWidgets);
            });
            this.controller.selectWidgets(duplicatedWidgets);
        }
        onDeleteSelectedWidgets() {
            this.controller.deleteWidgets(this.controller.getSelectedWidgets(true));
            this.controller.unselectWidget();
        }
    }
    exports.default = EventsHandler;
    function doResize(value, fn) {
        if (value > 10) {
            fn(value);
        }
    }
});
