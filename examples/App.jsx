import React from "react";
import TextLoop from "../src";
import cxs from "cxs";

class App extends React.PureComponent {
    render() {
        const styles = cxs({
            display: "block",
        });

        return (
            <div>
                <div className={styles}>
                    <h2 style={{ width: 500, textAlign: "left" }}>
                        Cool sentence,{" "}
                        <TextLoop interval={0}>
                            <span>one</span>
                            <span>two</span>
                            <span>three</span>
                        </TextLoop>
                    </h2>
                </div>
                <div className={styles}>
                    <h2 style={{ width: 500, textAlign: "left" }}>
                        Cool sentence,{" "}
                        <TextLoop interval={[3000, 1000, 3000]}>
                            <span>one</span>
                            <span>two</span>
                            <span>three</span>
                        </TextLoop>
                    </h2>
                </div>
                <div className={styles}>
                    <h2 style={{ width: 200 }}>
                        <TextLoop interval={3000} mask={true} noWrap={true}>
                            <span>Cool sentence, one</span>
                            <span>Cool sentence, two</span>
                            <span>Cool sentence, three</span>
                        </TextLoop>
                    </h2>
                </div>
                <div className={styles}>
                    <h2 style={{ width: 500, textAlign: "left" }}>
                        Cool sentence,{" "}
                        <TextLoop
                            interval={3000}
                            onChange={state => console.log(state)}
                        >
                            <span speed={200}>one</span>
                            <span>two</span>
                            <span>three</span>
                        </TextLoop>
                    </h2>
                </div>
                <div className={styles}>
                    <h2>
                        <TextLoop
                            mask={true}
                            speed={2000}
                            delay={0}
                            children={["d", "p"]}
                        />
                        <TextLoop
                            mask={true}
                            speed={2000}
                            delay={50}
                            children={["i", "r"]}
                        />
                        <TextLoop
                            mask={true}
                            speed={2000}
                            delay={100}
                            children={["g", "o"]}
                        />
                        <TextLoop
                            mask={true}
                            speed={2000}
                            delay={150}
                            children={["i", "d"]}
                        />
                        <TextLoop
                            mask={true}
                            speed={2000}
                            delay={200}
                            children={["t", "u"]}
                        />
                        <TextLoop
                            mask={true}
                            speed={2000}
                            delay={250}
                            children={["a", "c"]}
                        />
                        <TextLoop
                            mask={true}
                            speed={2000}
                            delay={300}
                            children={["l", "t"]}
                        />
                    </h2>
                </div>
            </div>
        );
    }
}

export default App;
