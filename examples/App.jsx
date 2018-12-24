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

class App extends React.PureComponent {
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
                    <Title>Woobly transition</Title>
                    <Example>
                        <TextLoop springConfig={{ stiffness: 180, damping: 8 }}>
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
                    <Title>Controlled props</Title>
                    <Example>
                        <TextLoop interval={interval} children={options} /> in
                        every category.
                    </Example>
                </Section>
                <Section>
                    <Title>Staggered (with delay prop)</Title>
                    <Example>
                        <TextLoop
                            mask={true}
                            interval={2000}
                            delay={0}
                            children={["d", "p"]}
                        />
                        <TextLoop
                            mask={true}
                            interval={2000}
                            delay={50}
                            children={["i", "r"]}
                        />
                        <TextLoop
                            mask={true}
                            interval={2000}
                            delay={100}
                            children={["g", "o"]}
                        />
                        <TextLoop
                            mask={true}
                            interval={2000}
                            delay={150}
                            children={["i", "d"]}
                        />
                        <TextLoop
                            mask={true}
                            interval={2000}
                            delay={200}
                            children={["t", "u"]}
                        />
                        <TextLoop
                            mask={true}
                            interval={2000}
                            delay={250}
                            children={["a", "c"]}
                        />
                        <TextLoop
                            mask={true}
                            interval={2000}
                            delay={300}
                            children={["l", "t"]}
                        />
                    </Example>
                </Section>
            </div>
        );
    }
}

export default App;
