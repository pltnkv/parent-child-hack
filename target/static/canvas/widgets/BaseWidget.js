define(["require", "exports", "utils/createElement"], function (require, exports, createElement_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class BaseWidget {
        constructor(controller, element, initData) {
            this.controller = controller;
            this.ghostElements = [];
            this.movingWidgets = [];
            this.element = element;
            if (initData.container) {
                this.containerType = 'flex';
            }
        }
        get isAttachedToCanvas() {
            return this.element.parentElement === this.controller.widgetsContainer;
        }
        get isContainer() {
            return this.element.getAttribute('container') !== null;
        }
        get isDADEnabled() {
            return this.element.getAttribute('disable-dad') === null;
        }
        set isDADEnabled(value) {
            if (value) {
                this.element.removeAttribute('disable-dad');
            }
            else {
                this.element.setAttribute('disable-dad', 'true');
            }
        }
        get containerType() {
            const attrVal = this.element.getAttribute('container');
            if (attrVal === 'flex') {
                return 'flex';
            }
            else if (attrVal === 'block') {
                return 'block';
            }
            else {
                return 'not';
            }
        }
        set containerType(value) {
            if (value === 'not') {
                let res;
                if (this.element.children.length > 0) {
                    res = confirm('Remove all children');
                }
                else {
                    res = true;
                }
                if (res) {
                    const childWidgets = Array.from(this.element.children).map(child => this.controller.getWidgetByElement(child));
                    this.controller.deleteWidgets(childWidgets);
                    this.element.removeAttribute('container');
                    this.element.style.display = 'block';
                }
            }
            else {
                this.element.setAttribute('container', value);
                this.element.style.display = value;
            }
        }
        contains(widget) {
            if (this === widget) {
                return false;
            }
            else {
                return this.element.contains(widget.element);
            }
        }
        destroy() {
            this.element.remove();
        }
        addGhosts(movingWidgets) {
            this.movingWidgets = movingWidgets;
            this.ghostElements = movingWidgets.map(mw => {
                return createElement_1.default({
                    position: 'relative',
                    pointerEvents: 'none',
                    border: '1px solid #2b79ff',
                    width: mw.w.width + 'px',
                    height: mw.w.height + 'px',
                    margin: mw.w.element.style.margin,
                });
            });
            this.ghostElements.forEach(ghost => {
                this.element.insertBefore(ghost, null);
            });
            this.highlighted = true;
        }
        //movingWidgets have to be the same as in addGhosts() method
        updateGhosts(mouseX, mouseY) {
        }
        applyGhosts() {
            this.movingWidgets.forEach((mw, index) => {
                const ghost = this.ghostElements[index];
                mw.w.element.style.top = ghost.style.top;
                mw.w.element.style.left = ghost.style.left;
                this.appendChild(mw.w);
            });
            this.removeGhosts();
            this.controller.forceUpdateSelectionBorder();
        }
        removeGhosts() {
            this.ghostElements.forEach(ghost => {
                ghost.remove();
            });
            this.ghostElements = [];
            this.movingWidgets = [];
            this.highlighted = false;
        }
        appendChild(widget) {
            //ghost instead of null
            this.element.insertBefore(widget.element, null);
            widget.element.style.position = 'static'; //TODO or relative if not flex model
        }
        get childrenWidgets() {
            return Array.from(this.element.children)
                .map(child => this.controller.getWidgetByElement(child));
        }
        get parentWidget() {
            if (this.isAttachedToCanvas) {
                return undefined;
            }
            else {
                return this.controller.getWidgetByElement(this.element.parentElement);
            }
        }
        ////////////////////////////////////////////////////////////////
        // Geometry
        ////////////////////////////////////////////////////////////////
        get x() {
            return parseInt(this.element.style.left);
        }
        set x(value) {
            this.element.style.left = value + 'px';
            this.controller.onWidgetRectChanged();
        }
        get y() {
            return parseInt(this.element.style.top);
        }
        set y(value) {
            this.element.style.top = value + 'px';
            this.controller.onWidgetRectChanged();
        }
        get width() {
            return parseInt(this.element.style.width);
        }
        set width(value) {
            this.element.style.width = value + 'px';
            this.controller.onWidgetRectChanged();
        }
        get height() {
            return parseInt(this.element.style.height);
        }
        set height(value) {
            this.element.style.height = value + 'px';
            this.controller.onWidgetRectChanged();
        }
        set highlighted(value) {
            if (value) {
                this.element.style.outline = '1px solid #000';
            }
            else {
                this.element.style.outline = 'none';
            }
        }
        get relativeBounds() {
            const x = this.x;
            const y = this.y;
            const width = this.width;
            const height = this.height;
            return {
                x,
                y,
                width,
                height,
                top: y,
                left: x,
                bottom: y + height,
                right: x + width,
            };
        }
        get absoluteBounds() {
            return this.element.getBoundingClientRect();
        }
    }
    exports.default = BaseWidget;
});
