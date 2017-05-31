import React from "react";
import { TransitionMotion, spring } from "react-motion";
import { css } from "glamor";

const defaultDimension = "auto";

class TextLoop extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            currentWord: 0,
            wordCount: 0,
            hasLoaded: false,
        };
    }

    componentDidMount() {
        // Starts animation
        const { speed } = this.props;
        if (speed > 0) {
            this.tick();
            this.tickInterval = setInterval(this.tick, this.props.speed);
        }
    }

    componentDidUpdate(prevProps) {
        const { speed } = this.props;
        if (prevProps.speed !== speed) {
            clearInterval(this.tickInterval);
            if (speed > 0) {
                this.tickInterval = setInterval(this.tick, speed);
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
            if (!state.hasLoaded) {
                return {
                    hasLoaded: true,
                };
            }

            return {
                currentWord: (state.currentWord + 1) %
                    React.Children.count(props.children),
                wordCount: (state.wordCount + 1) % 1000, // just a safe value to avoid infinite counts,
            };
        });
    };

    getOpacity() {
        return this.props.fade ? 0 : 1;
    }

    getDimensions() {
        if (this.wordBox == null) {
            return {
                width: defaultDimension,
                height: defaultDimension,
            };
        }

        return this.wordBox.getBoundingClientRect();
    }

    getStyles() {
        const { height } = this.getDimensions();

        return css(
            this.props.style,
            this.props.mask && { overflow: "hidden" },
            {
                display: "inline-block",
                position: "relative",
                verticalAlign: "top",
                height,
            }
        );
    }

    getTextStyles(isStatic) {
        const position = isStatic ? "relative" : "absolute";
        return css({
            whiteSpace: "nowrap",
            display: "inline-block",
            left: 0,
            top: 0,
            position,
        });
    }

    getTransitionMotionStyles() {
        const { children, springConfig } = this.props;
        const { wordCount, currentWord } = this.state;
        const options = React.Children.toArray(children);

        return [
            {
                key: `step-${wordCount}`,
                data: {
                    text: options[currentWord],
                },
                style: {
                    opacity: spring(1, springConfig),
                    translate: spring(0, springConfig),
                },
            },
        ];
    }

    renderStatic() {
        const children = React.Children.toArray(this.props.children)[0];
        return (
            <span
                ref={(n) => {
                    this.wordBox = n;
                }}
            >
                {children}
            </span>
        );
    }

    renderAnimation() {
        return (
            <TransitionMotion
                willLeave={this.willLeave}
                willEnter={this.willEnter}
                styles={this.getTransitionMotionStyles()}
            >
                {(interpolatedStyles) => {
                    const { height, width } = this.getDimensions();
                    return (
                        <div
                            style={{
                                transition: `width ${this.props.adjustingSpeed}ms linear`,
                                height,
                                width,
                            }}
                        >
                            {interpolatedStyles.map((config) => (
                                <div
                                    {...this.getTextStyles(
                                        width === defaultDimension
                                    )}
                                    ref={(n) => {
                                        this.wordBox = n;
                                    }}
                                    key={config.key}
                                    style={{
                                        opacity: config.style.opacity,
                                        transform: `translateY(${config.style.translate}px)`,
                                    }}
                                >
                                    {config.data.text}
                                </div>
                            ))}
                        </div>
                    );
                }}
            </TransitionMotion>
        );
    }

    render() {
        return (
            <div {...this.getStyles()}>
                {!this.state.hasLoaded ?
                    this.renderStatic() :
                    this.renderAnimation()}
            </div>
        );
    }
}

TextLoop.propTypes = {
    speed: React.PropTypes.number.isRequired,
    adjustingSpeed: React.PropTypes.number.isRequired,
    style: React.PropTypes.object,
    springConfig: React.PropTypes.object.isRequired,
    children: React.PropTypes.node.isRequired,
    fade: React.PropTypes.bool.isRequired,
    mask: React.PropTypes.bool.isRequired,
};

TextLoop.defaultProps = {
    speed: 3000,
    adjustingSpeed: 150,
    springConfig: { stiffness: 340, damping: 30 },
    fade: true,
    mask: false,
};

export default TextLoop;
