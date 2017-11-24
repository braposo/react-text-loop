import React from "react";
import TextLoop from "../lib";
import { css } from "glamor";

class App extends React.Component {
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
                    <TextLoop
                        interval={3000}
                        children={["right?", "isn't it?", "don't you think?"]}
                    />
                </h1>
            </div>
        );
    }
}

export default App;
