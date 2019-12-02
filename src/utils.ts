declare global {
    interface Window {
        mozRequestAnimationFrame: any;
        oRequestAnimationFrame: any;
        msRequestAnimationFrame: any;
        mozCancelRequestAnimationFrame: any;
        webkitCancelRequestAnimationFrame: any;
        oCancelRequestAnimationFrame: any;
        msCancelRequestAnimationFrame: any;
    }
}

const requestAnimFrame = ((): Function => {
    if (typeof window !== "undefined") {
        return (
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function cb(/* function */ callback): void {
                window.setTimeout(callback, 1000 / 60);
            }
        );
    }

    return (): void => {};
})();

export type RequestTimeout = number | void;
/*
 * Behaves the same as setTimeout except uses requestAnimationFrame() where possible for better performance
 * @param {function} fn The callback function
 * @param {int} delay The delay in milliseconds
 */
export const requestTimeout = function(
    fn: Function,
    delay: number
): RequestTimeout {
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

    let value: number | void = 0;

    function loop(): number | void {
        const current = new Date().getTime();

        const delta = current - start;

        if (delta >= delay) {
            fn.call(null);
        } else {
            value = requestAnimFrame(loop);
        }
    }

    value = requestAnimFrame(loop);
    return value;
};

/**
 * Behaves the same as clearTimeout except uses cancelRequestAnimationFrame() where possible for better performance
 * @param {int|object} fn The callback function
 */
export const clearRequestTimeout = function(handle): void {
    return window.cancelAnimationFrame
        ? window.cancelAnimationFrame(handle)
        : window.webkitCancelAnimationFrame
        ? window.webkitCancelAnimationFrame(handle)
        : window.webkitCancelRequestAnimationFrame
        ? window.webkitCancelRequestAnimationFrame(
              handle
          ) /* Support for legacy API */
        : window.mozCancelRequestAnimationFrame
        ? window.mozCancelRequestAnimationFrame(handle)
        : window.oCancelRequestAnimationFrame
        ? window.oCancelRequestAnimationFrame(handle)
        : window.msCancelRequestAnimationFrame
        ? window.msCancelRequestAnimationFrame(handle)
        : clearTimeout(handle);
};
