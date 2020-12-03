define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createBoard = void 0;
    function createBoard(render) {
        // Create state and state-controller
        // Store in this controller can be connected with WS connection
        //update loop
        function update() {
            //1) recalculate state
            const needToRerender = canvasEngine.update();
            //2) render updated state
            if (needToRerender) {
                render.render(canvasEngine);
            }
            requestAnimationFrame(update);
        }
        update();
    }
    exports.createBoard = createBoard;
});
