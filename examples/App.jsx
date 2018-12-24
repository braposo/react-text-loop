import React from "react";
import TextLoop from "../src";
import cxs from "cxs";

class App extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            options: ["One", "Two"],
            interval: 0,
        };
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                options: ["One", "Two", "Three"],
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
                <div>
                    <h2 style={{ width: 500, textAlign: "left" }}>
                        Cool sentence,{" "}
                        <TextLoop interval={0}>
                            <span>one</span>
                            <span>two</span>
                            <span>three</span>
                        </TextLoop>
                    </h2>
                </div>
                <div>
                    <h2 style={{ width: 500, textAlign: "left" }}>
                        Cool sentence,{" "}
                        <TextLoop interval={3000} children={options} />
                    </h2>
                </div>
                <div>
                    <h2 style={{ width: 200 }}>
                        <TextLoop interval={3000} mask={true} noWrap={true}>
                            <span>Cool sentence, one</span>
                            <span>Cool sentence, two</span>
                            <span>Cool sentence, three</span>
                        </TextLoop>
                    </h2>
                </div>
                <div>
                    <h2 style={{ width: 500, textAlign: "left" }}>
                        Cool sentence,{" "}
                        <TextLoop
                            interval={3000}
                            onChange={state => console.log(state)}
                        >
                            <span>one</span>
                            <span>two</span>
                            <span>three</span>
                        </TextLoop>
                    </h2>
                </div>
                <div>
                    <h2>
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
                    </h2>
                </div>
                <h2>
                    <TextLoop interval={interval} children={options} /> and
                    something else.
                </h2>
            </div>
        );
    }
}

export default App;
