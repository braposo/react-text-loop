import React, { useState, useRef } from "react";
import {
    TransitionMotion,
    spring,
    OpaqueConfig,
} from "react-motion";
import cxs from "cxs";
import {
    useRequestTimeout,
} from "../utils";

type Props = {
    children?: (JSX.Element | string)[];
    interval?: number | number[];
    delay?: number;
    adjustingSpeed?: number;
    springConfig?: {
        stiffness: number;
        damping: number;
    };
    fade?: boolean;
    mask?: boolean;
    noWrap?: boolean;
    className?: string;
    onChange?: Function;
};

function TextLoop({
    children,
    interval = 3000,
    delay = 0,
    adjustingSpeed = 150,
    springConfig = { stiffness: 340, damping: 30 },
    fade = true,
    mask = false,
    noWrap = true,
    className = "",
    onChange,
}: Props) {
    const elements = React.Children.toArray(children); // TODO: useMemo this?

    const [currentEl, setCurrentEl] = useState(elements[0]);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [wordCount, setWordCount] = useState(0);
    const [usedDelay, setUsedDelay] = useState(false);
    const wordBoxRef = useRef<HTMLDivElement | null>(null);

    const currentInterval = Array.isArray(interval)
        ? interval[currentWordIndex % interval.length]
        : interval;
    let nextTickInterval: number | null = usedDelay
        ? currentInterval
        : currentInterval + delay;
    if (!(currentInterval > 0 && React.Children.count(children) > 1)) {
        nextTickInterval = null; // Disable the timeout
    }

    // TODO: componentDidUpdate includes some code for currentInterval == 0 I think
    function tick() {
        setUsedDelay(true); // Next tick won't have a delay

        const newWordIndex = (currentWordIndex + 1) % (children?.length ?? 0);
        setCurrentWordIndex(newWordIndex);
        const nextEl = elements[newWordIndex];
        setCurrentEl(nextEl);

        setWordCount((wordCount + 1) % 1000); // just a safe value to avoid infinite counts

        if (onChange) {
            onChange(); // TODO: This used to take the state
        }
    }
    useRequestTimeout(tick, nextTickInterval, wordCount);

    function getDimensions() {
        if (wordBoxRef.current == null) {
            return {
                width: 0,
                height: 0,
            };
        }
        return wordBoxRef.current.getBoundingClientRect();
    }

    function getOpacity(): 0 | 1 {
        return fade ? 0 : 1;
    }

    function willLeave(): { opacity: OpaqueConfig; translate: OpaqueConfig } {
        const { height } = getDimensions();

        return {
            opacity: spring(getOpacity(), springConfig),
            translate: spring(-height, springConfig),
        };
    }

    // Fade in animation
    function willEnter(): { opacity: 0 | 1; translate: number } {
        const { height } = getDimensions();

        return {
            opacity: getOpacity(),
            translate: height,
        };
    }

    const wrapperStyles = cxs({
        ...(mask && { overflow: "hidden" }),
        ...{
            display: "inline-block",
            position: "relative",
            verticalAlign: "top",
        },
    });

    const elementStyles = cxs({
        display: "inline-block",
        left: 0,
        top: 0,
        whiteSpace: noWrap ? "nowrap" : "normal",
    });

    const transitionMotionStyles = [
        {
            key: `step-${wordCount}`,
            data: {
                currentEl,
            },
            style: {
                opacity: spring(1, springConfig),
                translate: spring(0, springConfig),
            },
        },
    ];

    return (
        <div className={`${wrapperStyles} ${className}`}>
            <TransitionMotion
                willLeave={willLeave}
                willEnter={willEnter}
                styles={transitionMotionStyles}
            >
                {(interpolatedStyles): JSX.Element => {
                    const { height, width } = getDimensions();

                    const parsedWidth =
                        wordBoxRef.current == null ? "auto" : width;

                    const parsedHeight =
                        wordBoxRef.current == null ? "auto" : height;

                    return (
                        <div
                            style={{
                                transition: `width ${adjustingSpeed}ms linear`,
                                height: parsedHeight,
                                width: parsedWidth,
                            }}
                        >
                            {interpolatedStyles.map(config => (
                                <div
                                    className={elementStyles}
                                    ref={wordBoxRef}
                                    key={config.key}
                                    style={{
                                        opacity: config.style.opacity,
                                        transform: `translateY(${config.style.translate}px)`,
                                        position:
                                            wordBoxRef.current === null
                                                ? "relative"
                                                : "absolute",
                                    }}
                                >
                                    {config.data.currentEl}
                                </div>
                            ))}
                        </div>
                    );
                }}
            </TransitionMotion>
        </div>
    );
}

export default TextLoop;
