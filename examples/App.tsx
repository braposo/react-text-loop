import React from "react";
import TextLoop from "../src";
import cxs from "cxs/component";

const Example = cxs("div")({
    fontSize: "24px",
});

const Title = cxs("div")({
    marginBottom: "5px",
    fontSize: "10px",
    fontWeight: 600,
    textTransform: "uppercase",
    color: "#aaa",
});

const Section = cxs("div")({
    marginBottom: "50px",
    fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
});

const StyledTextLoop = cxs(TextLoop)({
    display: "block",
});

class App extends React.PureComponent<{}, { options: string[]; interval: number }> {
    constructor(props) {
        super(props);
        this.state = {
            options: ["Trade faster", "Increase sales"],
            interval: 0,
        };
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                options: [
                    "Trade faster",
                    "Increase sales",
                    "Stock winners",
                    "Price perfectly",
                ],
            });
            console.log("change options");
        }, 10000);

        setTimeout(() => {
            this.setState({
                interval: 1000,
            });

            console.log("start");
            setTimeout(() => {
                this.setState({
                    interval: 0,
                });
                console.log("stop");
            }, 10000);
        }, 5000);
    }

    render() {
        const { options, interval } = this.state;

        return (
            <div>
                <Section>
                    <Title>Default</Title>
                    <Example>
                        <TextLoop>
                            <span>Trade faster</span>
                            <span>Increase sales</span>
                            <span>Stock winners</span>
                        </TextLoop>{" "}
                        in every category.
                    </Example>
                </Section>
                <Section>
                    <Title>Fast transition</Title>
                    <Example>
                        <TextLoop interval={100}>
                            <span>Trade faster</span>
                            <span>Increase sales</span>
                            <span>Stock winners</span>
                        </TextLoop>{" "}
                        in every category.
                    </Example>
                </Section>
                <Section>
                    <Title>Smooth animation (different spring config)</Title>
                    <Example>
                        <TextLoop
                            springConfig={{ stiffness: 70, damping: 31 }}
                            adjustingSpeed={500}
                        >
                            <span>Trade faster</span>
                            <span>Increase sales</span>
                            <span>Stock winners</span>
                        </TextLoop>{" "}
                        in every category.
                    </Example>
                </Section>
                <Section>
                    <Title>Variable interval</Title>
                    <Example>
                        <TextLoop interval={[3000, 1000]}>
                            <span>Trade faster</span>
                            <span>Increase sales</span>
                            <span>Stock winners</span>
                        </TextLoop>{" "}
                        in every category.
                    </Example>
                </Section>
                <Section>
                    <Title>Masked</Title>
                    <Example>
                        <TextLoop mask={true}>
                            <span>Trade faster</span>
                            <span>Increase sales</span>
                            <span>Stock winners</span>
                        </TextLoop>{" "}
                        in every category.
                    </Example>
                </Section>
                <Section>
                    <Title>
                        Controlled props (start/stop animation and change
                        options)
                    </Title>
                    <Example>
                        <TextLoop interval={interval} children={options} /> in
                        every category.
                    </Example>
                </Section>
                <Section>
                    <Title>
                        Staggered (with delay prop and custom styling)
                    </Title>
                    <Example>
                        <StyledTextLoop mask={true} fade={false}>
                            <span>Trade</span>
                            <span>Increase</span>
                            <span>Stock</span>
                        </StyledTextLoop>
                        <StyledTextLoop delay={500} mask={true} fade={false}>
                            <span>faster</span>
                            <span>sales</span>
                            <span>winners</span>
                        </StyledTextLoop>
                        <StyledTextLoop delay={1000} mask={true} fade={false}>
                            <span>in every category.</span>
                            <span>in something else.</span>
                            <span>in other category.</span>
                        </StyledTextLoop>
                    </Example>
                </Section>
            </div>
        );
    }
}

export default App;
