declare global {
    interface Window {
        mozRequestAnimationFrame;
        oRequestAnimationFrame;
        msRequestAnimationFrame;
        mozCancelRequestAnimationFrame;
        webkitCancelRequestAnimationFrame;
        oCancelRequestAnimationFrame;
        msCancelRequestAnimationFrame;
    }
}

declare interface Handle {
    value: number | void;
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

    return (): void => {
        /* return empty function */
    };
})();

export type RequestTimeout = object | number | void;
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

    const handle: Handle = { value: 0 };

    function loop(): number | void {
        const current = new Date().getTime();

        const delta = current - start;

        if (delta >= delay) {
            fn.call(null);
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
export const clearRequestTimeout = function(handle): void {
    return window.cancelAnimationFrame
        ? window.cancelAnimationFrame(handle.value)
        : window.webkitCancelAnimationFrame
        ? window.webkitCancelAnimationFrame(handle.value)
        : window.webkitCancelRequestAnimationFrame
        ? window.webkitCancelRequestAnimationFrame(
              handle.value
          ) /* Support for legacy API */
        : window.mozCancelRequestAnimationFrame
        ? window.mozCancelRequestAnimationFrame(handle.value)
        : window.oCancelRequestAnimationFrame
        ? window.oCancelRequestAnimationFrame(handle.value)
        : window.msCancelRequestAnimationFrame
        ? window.msCancelRequestAnimationFrame(handle.value)
        : clearTimeout(handle);
};
