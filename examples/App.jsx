import React from "react";
import TextLoop from "../src";
import { css } from "glamor";

class App extends React.PureComponent {
    render() {
        const styles = css({
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "90vh",
        });

        return (
            <div className={styles}>
                <h1 style={{ width: 500, textAlign: "left" }}>
                    Cool sentence,{" "}
                    <TextLoop interval={3000}>
                        <span speed={200}>a</span>
                        <span>b</span>
                        c
                    </TextLoop>
                </h1>
            </div>
        );
    }
}

export default App;
