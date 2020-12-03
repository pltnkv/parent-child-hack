define(["require", "exports", "board/canvas/widgets/ShapeWidget"], function (require, exports, ShapeWidget_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let idCounter = 0;
    class CanvasController {
        constructor(canvasContainer) {
            this.canvasContainer = canvasContainer;
            this.widgets = [];
        }
        //////////////////////////////////////////////////////
        // API — single way to read / write canvas state   ///
        //////////////////////////////////////////////////////
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
        createShapeWidget(parent, data) {
            this.widgets.push(new ShapeWidget_1.default(parent ? parent.element : this.canvasContainer, {
                id: ++idCounter,
                type: 'shape',
                x: data.x || 0,
                y: data.y || 0,
                width: 100,
                height: 100,
                color: data.color || '#000000',
                container: false,
            }));
        }
        deleteWidget(id) {
            // this.state.widgets = this.state.widgets.filter(w => w.id !== id)
            // this.stateChanged = true
        }
        moveStart() {
        }
        moveEnd() {
            //cleanup
        }
        moveWidget(widget, newX, newY) {
            /**
             const container = findTopIntersectedConteiner()
    
             if(this.prevIntersectedContainer !== container) {
                revertState(this.prevIntersectedContainer)
                this.prevIntersectedContainer = container
                if(this.prevIntersectedContainer) {
                    saveState(this.prevIntersectedContainer)
                }
            }
    
             if(container) {
                showPossiblePositionForChild(container, newY, newY, childBoundingBox)
            }
    
             //move moving widget
             */
            // const w = this.state.widgets.find(w => w.id === widgetId)
            // if (w) {
            // 	w.x = newX
            // 	w.y = newY
            // } else {
            // 	throw new Error('Widget not found')
            // }
            // this.stateChanged = true
        }
        selectWidget(widget) {
            this.currentSelectedWidget = widget;
        }
        unselectWidget() {
            console.log('unselectWidget');
            this.currentSelectedWidget = undefined;
        }
        getSelectedWidget() {
            return this.currentSelectedWidget;
        }
        findWidgetByElement(element) {
            return this.widgets.find(w => {
                return w.element === element;
            });
        }
    }
    exports.default = CanvasController;
});
