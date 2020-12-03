define(["require", "exports", "canvas/CanvasController", "canvas/registerEvents", "canvas/EventsHandler", "SidebarController", "data"], function (require, exports, CanvasController_1, registerEvents_1, EventsHandler_1, SidebarController_1, data_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //render to html
    const canvasContainer = document.querySelector('.canvas-container');
    const sidebarContainer = document.querySelector('.sidebar-container');
    const sidebarController = new SidebarController_1.default(sidebarContainer);
    const canvasController = new CanvasController_1.default(canvasContainer, sidebarController);
    const eventHandler = new EventsHandler_1.default(canvasController);
    registerEvents_1.default(eventHandler, canvasController);
    let initData = localStorage.getItem('canvas');
    if (!initData) {
        initData = data_1.kanban;
    }
    if (initData) {
        const newWidgets = canvasController.createWidgetFromHTML(initData);
        newWidgets.forEach(nw => {
            canvasController.appendToCanvas(nw);
        });
    }
    else {
        canvasController.createShapeWidget({ x: 10, y: 10, color: '#FF0000' });
        const cnt = canvasController.createShapeWidget({ x: 100, y: 100, width: 300, height: 200, color: '#00FF00', container: true });
        canvasController.createShapeWidget({ x: 10, y: 10, color: '#666666' }, cnt);
        canvasController.createShapeWidget({ x: 10, y: 10, color: '#666666' }, cnt);
    }
    ///////////////////////////////////////////////////////////////////////////
    //UI
    ///////////////////////////////////////////////////////////////////////////
    document.querySelector('.add-shape').addEventListener('click', () => {
        canvasController.createShapeWidget({ x: 10, y: 10, color: '#FF0000' });
    });
    document.querySelector('.add-shape-100').addEventListener('click', () => {
        for (let i = 0; i < 100; i++) {
            canvasController.createShapeWidget({ x: 10, y: 10 + i, color: '#FF0000' });
        }
    });
    document.querySelector('.add-container').addEventListener('click', () => {
        canvasController.createShapeWidget({ x: 100, y: 100, width: 300, height: 200, color: '#00FF00', container: true });
    });
    document.querySelector('.clear-storage').addEventListener('click', () => {
        localStorage.removeItem('canvas');
    });
});
