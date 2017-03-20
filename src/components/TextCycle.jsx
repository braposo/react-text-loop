import React from "react";
import { TransitionMotion, spring } from "react-motion";

class TextCycle extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            currentWord: 0,
            initialWidth: 0,
        };
    }

    componentDidMount() {
        this.setDefaultWidth();
        this.tickInterval = setInterval(this.tick, this.props.speed);
    }

    componentWillUnmount() {
        clearInterval(this.tickInterval);
    }

    setDefaultWidth() {
        this.setState((prevState, props) => {
            return {
                initialWidth: props.initialWidth || this.wordBox.getBoundingClientRect().width,
            };
        });
    }

    willLeave = () => {
        return {
            opacity: spring(0, this.props.springConfig),
            translate: spring(-43, this.props.springConfig),
        };
    };

    willEnter() {
        return {
            opacity: 0,
            translate: 43,
        };
    }

    tick = () => {
        this.setState((prevState, props) => {
            return {
                currentWord: (prevState.currentWord + 1) % props.options.length,
            };
        });
    };

    getStyles = () => {
        return {
            ...this.props.style,
            display: "inline-block",
            position: "relative",
            verticalAlign: "top",
            height: this.props.height,
        };
    };

    render() {
        const { height } = this.props;
        return (
            <div
                style={this.getStyles()}
            >
                <TransitionMotion
                    willLeave={this.willLeave}
                    willEnter={this.willEnter}
                    styles={[
                        {
                            key: `step${this.state.currentWord}`,
                            data: {
                                text: this.props.options[this.state.currentWord],
                            },
                            style: {
                                opacity: spring(1, this.props.springConfig),
                                translate: spring(0, this.props.springConfig),
                            },
                        },
                    ]}
                >
                    {
                        (interpolatedStyles) => {
                            const width = this.state.currentWord === 0 ? this.state.initialWidth : this.wordBox.getBoundingClientRect().width;

                            return (
                                <div
                                    style={{
                                        transition: `width ${this.props.adjustingSpeed} linear`,
                                        height,
                                        width,
                                    }}
                                >
                                    {
                                        interpolatedStyles.map(
                                            (config) => (
                                                <div
                                                    ref={(n) => { this.wordBox = n; }}
                                                    key={config.key}
                                                    style={{
                                                        opacity: config.style.opacity,
                                                        transform: `translateY(${config.style.translate}px)`,
                                                        whiteSpace: "nowrap",
                                                        display: "inline-block",
                                                        position: "absolute",
                                                        left: 0,
                                                        top: 0,
                                                        lineHeight: `${height}px`,
                                                    }}
                                                >
                                                    {config.data.text}
                                                </div>
                                            )
                                        )
                                    }
                                </div>
                            );
                        }
                    }
                </TransitionMotion>
            </div>
        );
    }
}

TextCycle.propTypes = {
    options: React.PropTypes.array.isRequired,
    speed: React.PropTypes.number.isRequired,
    adjustingSpeed: React.PropTypes.string.isRequired,
    initialWidth: React.PropTypes.number, // eslint-disable-line react/no-unused-prop-types
    height: React.PropTypes.number.isRequired,
    style: React.PropTypes.object,
    springConfig: React.PropTypes.object.isRequired,
};

TextCycle.defaultProps = {
    speed: 3000,
    adjustingSpeed: "150ms",
    springConfig: { stiffness: 340, damping: 30 },
};

export default TextCycle;
