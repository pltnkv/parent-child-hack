define(["require", "exports", "canvas/widgets/ShapeWidget", "canvas/ControlsLayer", "utils/createElement", "utils/getUnionBounds", "utils/getRootElements"], function (require, exports, ShapeWidget_1, ControlsLayer_1, createElement_1, getUnionBounds_1, getRootElements_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class CanvasController {
        constructor(canvasContainer, sidebarController) {
            this.canvasContainer = canvasContainer;
            this.selectedWidgets = [];
            this.widgets = [];
            this.sidebar = sidebarController;
            this.widgetsContainer = createElement_1.default({ position: 'absolute', width: '100%', height: '100%' });
            canvasContainer.appendChild(this.widgetsContainer);
            this.controlsLayer = new ControlsLayer_1.default(canvasContainer);
            setInterval(() => {
                this.saveData();
            }, 500);
        }
        createWidgetFromHTML(html) {
            const div = document.createElement('div');
            div.innerHTML = html.trim();
            return Array.from(div.children).map(child => {
                return this.createWidgetFromElement(child);
            });
        }
        createWidgetFromElement(el) {
            const widget = new ShapeWidget_1.default(//todo not only ShapeWidget
            this, {
                type: 'shape',
                x: 0,
                y: 0,
                width: 0,
                height: 0,
                color: '#000000',
                container: false,
            });
            widget.element = el;
            this.widgets.push(widget);
            Array.from(widget.element.children).forEach(child => {
                this.createWidgetFromElement(child);
            });
            return widget;
        }
        createTextWidget(data) {
            // this.state.widgets.push({
            // 	id: ++idCounter,
            // 	type: 'text',
            // 	x: data.x || 0,
            // 	y: data.y || 0,
            // 	text: data.text || 'text',
            // 	color: data.color || '#000000',
            // })
            // this.stateChanged = true
        }
        createShapeWidget(data, parent) {
            const widget = new ShapeWidget_1.default(this, {
                type: 'shape',
                x: data.x || 0,
                y: data.y || 0,
                width: data.width || 100,
                height: data.height || 100,
                color: data.color || '#000000',
                container: data.container || false,
            });
            this.widgets.push(widget);
            if (parent) {
                parent.appendChild(widget);
            }
            else {
                this.appendToCanvas(widget);
            }
            return widget;
        }
        appendToCanvas(widget) {
            //TODO support zIndex
            this.widgetsContainer.appendChild(widget.element);
            widget.element.style.position = 'absolute';
            this.saveData();
        }
        getWidgetByElement(element) {
            return element
                ? this.widgets.find(w => element === w.element)
                : undefined;
        }
        moveWidget(widget, newX, newY) {
            widget.x = newX;
            widget.y = newY;
        }
        selectWidgets(widgets) {
            this.selectedWidgets = widgets.filter((item, pos, self) => self.indexOf(item) === pos);
            this.forceUpdateSelectionBorder();
            this.sidebar.onSelectionUpdated(this.selectedWidgets);
        }
        forceUpdateSelectionBorder() {
            if (this.selectedWidgets.length > 0) {
                this.controlsLayer.drawSelectionBorder(getUnionBounds_1.default(this.selectedWidgets.map(w => w.absoluteBounds)));
            }
            else {
                this.controlsLayer.hideSelectionBorder();
            }
        }
        unselectWidget() {
            if (this.selectedWidgets.length > 0) {
                this.selectedWidgets = [];
                this.forceUpdateSelectionBorder();
                this.sidebar.onSelectionClear();
            }
        }
        getSelectedWidgets(rootOnly = false) {
            if (rootOnly) {
                return getRootElements_1.default(this.selectedWidgets);
            }
            else {
                return this.selectedWidgets;
            }
        }
        deleteWidgets(deletingWidgets) {
            deletingWidgets.forEach(w => {
                const children = w.childrenWidgets;
                if (children.length > 0) {
                    this.deleteWidgets(children);
                }
                w.destroy();
            });
            this.widgets = this.widgets.filter(w => deletingWidgets.indexOf(w) === -1);
            this.saveData();
        }
        isWidgetsSelected() {
            return this.selectedWidgets.length > 0;
        }
        findWidgetByElement(element) {
            return this.widgets.find(w => {
                return w.element === element;
            });
        }
        findTargetContainer(absPoint, movingWidgets) {
            const elements = document.elementsFromPoint(absPoint.x, absPoint.y);
            let widgetElement;
            const targetWidgetElement = elements.find(elementUnderPoint => {
                if (elementUnderPoint.getAttribute('data-id')) {
                    widgetElement = this.getWidgetByElement(elementUnderPoint);
                    return !!widgetElement
                        && widgetElement.isContainer
                        && widgetElement.isDADEnabled
                        && !movingWidgets.some(mw => widgetElement === mw.w);
                }
                else {
                    return false;
                }
            });
            return targetWidgetElement ? widgetElement : undefined;
        }
        saveData() {
            localStorage.setItem('canvas', this.widgetsContainer.innerHTML);
        }
        ////////////////////////////////////////
        // Events
        onWidgetRectChanged() {
            this.forceUpdateSelectionBorder();
        }
    }
    exports.default = CanvasController;
});
