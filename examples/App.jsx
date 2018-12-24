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
                        <TextLoop interval={3000}>
                            <span speed={200}>one</span>
                            <span>two</span>
                            <span>three</span>
                        </TextLoop>
                    </h2>
                </div>
                <div className={styles}>
                    <h2 style={{ width: 500, textAlign: "center" }}>
                        Cool sentence,{" "}
                        <TextLoop interval={3000}>
                            <span speed={200}>one</span>
                            <span>two</span>
                            <span>three</span>
                        </TextLoop>
                    </h2>
                </div>
                <div className={styles}>
                    <h2 style={{ width: 200 }}>
                        <TextLoop interval={3000}>
                            <span>Cool sentence, one</span>
                            <span>Cool sentence, two</span>
                            <span>Cool sentence, three</span>
                        </TextLoop>
                    </h2>
                </div>
            </div>
        );
    }
}

export default App;
