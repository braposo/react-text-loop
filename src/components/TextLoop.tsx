import React, { useState, useRef } from "react";
import {
    TransitionMotion,
    spring,
    OpaqueConfig,
    TransitionStyle,
} from "react-motion";
import cxs from "cxs";
import isEqual from "react-fast-compare";
import {
    useRequestTimeout,
    requestTimeout,
    clearRequestTimeout,
    RequestTimeout,
} from "../utils";

type Props = {
    children?: (JSX.Element | string)[];
    interval: number | number[];
    delay: number;
    adjustingSpeed: number;
    springConfig: {
        stiffness: number;
        damping: number;
    };
    fade: boolean;
    mask: boolean;
    noWrap: boolean;
    className?: string;
    onChange?: Function;
};

type State = {
    elements: (JSX.Element | string | undefined)[];
    currentEl: JSX.Element | string | undefined;
    currentWordIndex: number;
    wordCount: number;
    currentInterval: number;
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

        const newWordIndex = (currentWordIndex + 1) % elements.length;
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

export class TextLoopOld extends React.PureComponent<Props, State> {
    isUnMounting = false;

    tickDelay: RequestTimeout = 0;

    tickLoop: RequestTimeout = 0;

    wordBox: HTMLDivElement | null = null;

    static defaultProps: Props = {
        interval: 3000,
        delay: 0,
        adjustingSpeed: 150,
        springConfig: { stiffness: 340, damping: 30 },
        fade: true,
        mask: false,
        noWrap: true,
    };

    constructor(props: Props) {
        super(props);
        const elements = React.Children.toArray(props.children);

        this.state = {
            elements,
            currentEl: elements[0],
            currentWordIndex: 0,
            wordCount: 0,
            currentInterval: Array.isArray(props.interval)
                ? props.interval[0]
                : props.interval,
        };
    }

    componentDidMount(): void {
        // Starts animation
        const { delay } = this.props;
        const { currentInterval, elements } = this.state;

        if (currentInterval > 0 && elements.length > 1) {
            this.tickDelay = requestTimeout(() => {
                this.tickLoop = requestTimeout(this.tick, currentInterval);
            }, delay);
        }
    }

    componentDidUpdate(prevProps: Props, prevState: State): void {
        const { interval, children, delay } = this.props as Props;
        const { currentWordIndex } = this.state;

        const currentInterval = Array.isArray(interval)
            ? interval[currentWordIndex % interval.length]
            : interval;

        if (prevState.currentInterval !== currentInterval) {
            this.clearTimeouts();

            if (currentInterval > 0 && React.Children.count(children) > 1) {
                this.tickDelay = requestTimeout(() => {
                    this.tickLoop = requestTimeout(this.tick, currentInterval);
                }, delay);
            } else {
                this.setState((state, props) => {
                    const { currentWordIndex: _currentWordIndex } = state;

                    return {
                        currentInterval: Array.isArray(props.interval)
                            ? props.interval[
                                  _currentWordIndex % props.interval.length
                              ]
                            : props.interval,
                    };
                });
            }
        }

        if (!isEqual(prevProps.children, children)) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                elements: React.Children.toArray(children),
            });
        }
    }

    componentWillUnmount(): void {
        this.isUnMounting = true;
        this.clearTimeouts();
    }

    clearTimeouts(): void {
        if (this.tickLoop != null) {
            clearRequestTimeout(this.tickLoop);
        }

        if (this.tickDelay != null) {
            clearRequestTimeout(this.tickDelay);
        }
    }

    // Fade out animation
    willLeave = (): { opacity: OpaqueConfig; translate: OpaqueConfig } => {
        const { height } = this.getDimensions();

        return {
            opacity: spring(this.getOpacity(), this.props.springConfig),
            translate: spring(-height, this.props.springConfig),
        };
    };

    // Fade in animation
    willEnter = (): { opacity: 0 | 1; translate: number } => {
        const { height } = this.getDimensions();

        return {
            opacity: this.getOpacity(),
            translate: height,
        };
    };

    tick = (): void => {
        if (!this.isUnMounting) {
            this.setState(
                (state, props) => {
                    const currentWordIndex =
                        (state.currentWordIndex + 1) % state.elements.length;

                    const currentEl = state.elements[currentWordIndex];
                    const updatedState = {
                        currentWordIndex,
                        currentEl,
                        wordCount: (state.wordCount + 1) % 1000, // just a safe value to avoid infinite counts,
                        currentInterval: Array.isArray(props.interval)
                            ? props.interval[
                                  currentWordIndex % props.interval.length
                              ]
                            : props.interval,
                    };
                    if (props.onChange) {
                        props.onChange(updatedState);
                    }

                    return updatedState;
                },
                () => {
                    if (this.state.currentInterval > 0) {
                        this.clearTimeouts();
                        this.tickLoop = requestTimeout(
                            this.tick,
                            this.state.currentInterval
                        );
                    }
                }
            );
        }
    };

    getOpacity(): 0 | 1 {
        return this.props.fade ? 0 : 1;
    }

    getDimensions(): ClientRect | DOMRect | { width: 0; height: 0 } {
        if (this.wordBox == null) {
            return {
                width: 0,
                height: 0,
            };
        }

        return this.wordBox.getBoundingClientRect();
    }

    wrapperStyles = cxs({
        ...(this.props.mask && { overflow: "hidden" }),
        ...{
            display: "inline-block",
            position: "relative",
            verticalAlign: "top",
        },
    });

    elementStyles = cxs({
        display: "inline-block",
        left: 0,
        top: 0,
        whiteSpace: this.props.noWrap ? "nowrap" : "normal",
    });

    getTransitionMotionStyles(): TransitionStyle[] {
        const { springConfig } = this.props;
        const { wordCount, currentEl } = this.state;

        return [
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
    }

    render(): JSX.Element {
        const { className = "" } = this.props;
        return (
            <div className={`${this.wrapperStyles} ${className}`}>
                <TransitionMotion
                    willLeave={this.willLeave}
                    willEnter={this.willEnter}
                    styles={this.getTransitionMotionStyles()}
                >
                    {(interpolatedStyles): JSX.Element => {
                        const { height, width } = this.getDimensions();

                        const parsedWidth =
                            this.wordBox == null ? "auto" : width;

                        const parsedHeight =
                            this.wordBox == null ? "auto" : height;

                        return (
                            <div
                                style={{
                                    transition: `width ${this.props.adjustingSpeed}ms linear`,
                                    height: parsedHeight,
                                    width: parsedWidth,
                                }}
                            >
                                {interpolatedStyles.map(config => (
                                    <div
                                        className={this.elementStyles}
                                        ref={(n: HTMLDivElement): void => {
                                            this.wordBox = n;
                                        }}
                                        key={config.key}
                                        style={{
                                            opacity: config.style.opacity,
                                            transform: `translateY(${config.style.translate}px)`,
                                            position:
                                                this.wordBox == null
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
}

export default TextLoop;
