import React from "react";
import { TransitionMotion, spring } from "react-motion";
import cxs from "cxs";
import PropTypes from "prop-types";

class TextLoop extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            currentWordIndex: 0,
            wordCount: 0,
            element: React.Children.toArray(props.children)[0],
        };
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

    componentDidMount() {
        // Starts animation
        const { interval } = this.props;
        if (interval > 0) {
            this.tickInterval = setInterval(this.tick, interval);
        }
    }

    componentDidUpdate(prevProps) {
        const { interval } = this.props;
        if (prevProps.interval !== interval) {
            clearInterval(this.tickInterval);
            if (interval > 0) {
                this.tickInterval = setInterval(this.tick, interval);
            }
        }
    }

    componentWillUnmount() {
        if (this.tickInterval != null) {
            clearInterval(this.tickInterval);
        }
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
        this.setState((state, props) => {
            const options = React.Children.toArray(props.children);
            const currentWordIndex =
                (state.currentWordIndex + 1) %
                React.Children.count(props.children);

            const updatedState = {
                currentWordIndex,
                wordCount: (state.wordCount + 1) % 1000, // just a safe value to avoid infinite counts,
                element: options[currentWordIndex],
            };
            if (props.onChange) {
                props.onChange(updatedState);
            }

            return updatedState;
        });
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

    getTransitionMotionStyles() {
        const { springConfig } = this.props;
        const { wordCount, element } = this.state;

        return [
            {
                key: `step-${wordCount}`,
                data: {
                    element,
                },
                style: {
                    opacity: spring(1, springConfig),
                    translate: spring(0, springConfig),
                },
            },
        ];
    }

    render() {
        return (
            <div className={`${this.wrapperStyles} ${this.props.className}`}>
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
                                        {config.data.element}
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
    interval: PropTypes.number.isRequired,
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
    adjustingSpeed: 150,
    springConfig: { stiffness: 340, damping: 30 },
    fade: true,
    mask: false,
    noWrap: false,
};

export default TextLoop;
