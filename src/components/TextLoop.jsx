import React from "react";
import { TransitionMotion, spring } from "react-motion";
import cxs from "cxs";
import PropTypes from "prop-types";
import { requestTimeout, clearRequestTimeout } from "../utils";
import isEqual from "react-fast-compare";

class TextLoop extends React.PureComponent {
    constructor(props) {
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

    clearTimeouts() {
        if (this.tickLoop != null) {
            clearRequestTimeout(this.tickLoop);
        }

        if (this.tickDelay != null) {
            clearRequestTimeout(this.tickDelay);
        }
    }

    componentDidMount() {
        // Starts animation
        const { delay } = this.props;
        const { currentInterval, elements } = this.state;

        if (currentInterval > 0 && elements.length > 1) {
            this.tickDelay = requestTimeout(() => {
                this.tickLoop = requestTimeout(this.tick, currentInterval);
            }, delay);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { interval, children, delay } = this.props;
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
            }
        }

        if (!isEqual(prevProps.children, children)) {
            this.setState({
                elements: React.Children.toArray(children),
            });
        }
    }

    componentWillUnmount() {
        this.clearTimeouts();
    }

    // Fade out animation
    willLeave = () => {
        const { height } = this.getDimensions();

        return {
            opacity: spring(this.getOpacity(), this.props.springConfig),
            translate: spring(-height, this.props.springConfig),
        };
    };

    // Fade in animation
    willEnter = () => {
        const { height } = this.getDimensions();

        return {
            opacity: this.getOpacity(),
            translate: height,
        };
    };

    tick = () => {
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
    };

    getOpacity() {
        return this.props.fade ? 0 : 1;
    }

    getDimensions() {
        if (this.wordBox == null) {
            return {
                width: "auto",
                height: "auto",
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

    getTransitionMotionStyles() {
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

    render() {
        const { className = "" } = this.props;
        return (
            <div className={`${this.wrapperStyles} ${className}`}>
                <TransitionMotion
                    willLeave={this.willLeave}
                    willEnter={this.willEnter}
                    styles={this.getTransitionMotionStyles()}
                >
                    {interpolatedStyles => {
                        const { height, width } = this.getDimensions();
                        return (
                            <div
                                style={{
                                    transition: `width ${
                                        this.props.adjustingSpeed
                                    }ms linear`,
                                    height,
                                    width,
                                }}
                            >
                                {interpolatedStyles.map(config => (
                                    <div
                                        className={this.elementStyles}
                                        ref={n => {
                                            this.wordBox = n;
                                        }}
                                        key={config.key}
                                        style={{
                                            opacity: config.style.opacity,
                                            transform: `translateY(${
                                                config.style.translate
                                            }px)`,
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

TextLoop.propTypes = {
    interval: PropTypes.oneOfType([PropTypes.number, PropTypes.array])
        .isRequired,
    delay: PropTypes.number.isRequired,
    adjustingSpeed: PropTypes.number.isRequired,
    springConfig: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    fade: PropTypes.bool.isRequired,
    mask: PropTypes.bool.isRequired,
    noWrap: PropTypes.bool.isRequired,
    className: PropTypes.string,
};

TextLoop.defaultProps = {
    interval: 3000,
    delay: 0,
    adjustingSpeed: 150,
    springConfig: { stiffness: 340, damping: 30 },
    fade: true,
    mask: false,
    noWrap: true,
};

export default TextLoop;
