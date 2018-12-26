const requestAnimFrame = (function() {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(/* function */ callback) {
            window.setTimeout(callback, 1000 / 60);
        }
    );
})();

/*
 * Behaves the same as setTimeout except uses requestAnimationFrame() where possible for better performance
 * @param {function} fn The callback function
 * @param {int} delay The delay in milliseconds
 */
export const requestTimeout = function(fn, delay) {
    if (
        !window.requestAnimationFrame &&
        !window.webkitRequestAnimationFrame &&
        !(
            window.mozRequestAnimationFrame &&
            window.mozCancelRequestAnimationFrame
        ) && // Firefox 5 ships without cancel support
        !window.oRequestAnimationFrame &&
        !window.msRequestAnimationFrame
    ) {
        return window.setTimeout(fn, delay);
    }

    const start = new Date().getTime();

    const handle = {};

    function loop() {
        const current = new Date().getTime();

        const delta = current - start;

        if (delta >= delay) {
            fn.call();
        } else {
            handle.value = requestAnimFrame(loop);
        }
    }

    handle.value = requestAnimFrame(loop);
    return handle;
};

/**
 * Behaves the same as clearTimeout except uses cancelRequestAnimationFrame() where possible for better performance
 * @param {int|object} fn The callback function
 */
export const clearRequestTimeout = function(handle) {
    return window.cancelAnimationFrame ?
        window.cancelAnimationFrame(handle.value) :
        window.webkitCancelAnimationFrame ?
            window.webkitCancelAnimationFrame(handle.value) :
            window.webkitCancelRequestAnimationFrame ?
                window.webkitCancelRequestAnimationFrame(
                    handle.value
                ) : /* Support for legacy API */
                window.mozCancelRequestAnimationFrame ?
                    window.mozCancelRequestAnimationFrame(handle.value) :
                    window.oCancelRequestAnimationFrame ?
                        window.oCancelRequestAnimationFrame(handle.value) :
                        window.msCancelRequestAnimationFrame ?
                            window.msCancelRequestAnimationFrame(handle.value) :
                            clearTimeout(handle);
};
