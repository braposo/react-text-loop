import React from "react";
import { TransitionMotion, spring } from "react-motion";

class TextLoop extends React.PureComponent {
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
        const autoWidth = this.wordBox.getBoundingClientRect().width;

        this.setState({
            initialWidth: this.props.initialWidth || autoWidth,
        });
    }

    handleWillLeave = () => {
        return {
            opacity: spring(0, this.props.springConfig),
            translate: spring(-43, this.props.springConfig),
        };
    };

    handleWillEnter() {
        return {
            opacity: 0,
            translate: 43,
        };
    }

    tick = () => {
        this.setState({
            currentWord: (this.state.currentWord + 1) % this.props.options.length,
        });
    };

    getWidth() {
        if (this.state.currentWord === 0) {
            return this.state.initialWidth;
        }

        return this.wordBox.getBoundingClientRect().width;
    }

    getStyles() {
        return {
            ...this.props.style,
            display: "inline-block",
            position: "relative",
            verticalAlign: "top",
            height: this.props.height,
        };
    }

    getTransitionMotionStyles() {
        return [
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
        ];
    }

    getTextStyles(config) {
        return {
            opacity: config.style.opacity,
            transform: `translateY(${config.style.translate}px)`,
            whiteSpace: "nowrap",
            display: "inline-block",
            position: "absolute",
            left: 0,
            top: 0,
            lineHeight: `${this.props.height}px`,
        };
    }

    render() {
        return (
            <div
                style={this.getStyles()}
            >
                <TransitionMotion
                    willLeave={this.handleWillLeave}
                    willEnter={this.handleWillEnter}
                    styles={this.getTransitionMotionStyles()}
                >
                    {
                        (interpolatedStyles) => {
                            return (
                                <div
                                    style={{
                                        transition: `width ${this.props.adjustingSpeed} linear`,
                                        height: this.props.height,
                                        width: this.getWidth(),
                                    }}
                                >
                                    {
                                        interpolatedStyles.map(
                                            (config) => (
                                                <div
                                                    ref={(n) => { this.wordBox = n; }}
                                                    key={config.key}
                                                    style={this.getTextStyles(config)}
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

TextLoop.propTypes = {
    options: React.PropTypes.array.isRequired,
    speed: React.PropTypes.number.isRequired,
    adjustingSpeed: React.PropTypes.string.isRequired,
    initialWidth: React.PropTypes.number, // eslint-disable-line react/no-unused-prop-types
    height: React.PropTypes.number.isRequired,
    style: React.PropTypes.object,
    springConfig: React.PropTypes.object.isRequired,
};

TextLoop.defaultProps = {
    speed: 3000,
    adjustingSpeed: "150ms",
    springConfig: { stiffness: 340, damping: 30 },
};

export default TextLoop;
