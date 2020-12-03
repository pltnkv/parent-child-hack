define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function throttle(func, ms, scope) {
        let isThrottled = false;
        let savedArgs;
        function wrapper() {
            if (isThrottled) { // (2)
                savedArgs = arguments;
                return;
            }
            func.apply(scope, arguments); // (1)
            isThrottled = true;
            setTimeout(function () {
                isThrottled = false; // (3)
                if (savedArgs) {
                    wrapper.apply(scope, savedArgs);
                    savedArgs = null;
                }
            }, ms);
        }
        return wrapper;
    }
    exports.default = throttle;
});
