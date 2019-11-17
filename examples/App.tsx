import React, { useState, useEffect } from "react";
import cxs from "cxs/component";
import TextLoop from "../src";

const Example: React.FunctionComponent = cxs("div")({
    fontSize: "24px",
});

const Title: React.FunctionComponent = cxs("div")({
    marginBottom: "5px",
    fontSize: "10px",
    fontWeight: 600,
    textTransform: "uppercase",
    color: "#aaa",
});

const Section: React.FunctionComponent = cxs("div")({
    marginBottom: "50px",
    fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
});

const StyledTextLoop: React.FunctionComponent<Partial<TextLoop["props"]>> = cxs(
    TextLoop
)({
    display: "block",
});

const BaseExample: React.FunctionComponent = (): JSX.Element => (
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
);

const FastExample: React.FunctionComponent = (): JSX.Element => (
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
);

const SmoothExample: React.FunctionComponent = (): JSX.Element => (
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
);

const VariableExample: React.FunctionComponent = (): JSX.Element => (
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
);

const MaskedExample: React.FunctionComponent = (): JSX.Element => (
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
);

const ControlledExample: React.FunctionComponent = (): JSX.Element => {
    const [options, setOptions] = useState(["Trade faster", "Increase sales"]);
    const [interval, setInterval] = useState(0);

    useEffect(() => {
        const optionsTimeout = setTimeout(() => {
            setOptions([
                "Trade faster",
                "Increase sales",
                "Stock winners",
                "Price perfectly",
            ]);
            console.log("change options");
        }, 10000);

        return (): void => {
            clearTimeout(optionsTimeout);
        };
    }, []);

    useEffect(() => {
        const intervalStartTimeout = setTimeout(() => {
            console.log("start");
            setInterval(1000);
        }, 5000);
        return (): void => {
            clearTimeout(intervalStartTimeout);
        };
    }, []);

    useEffect(() => {
        const intervalStopTimeout = setTimeout(() => {
            setInterval(0);
            console.log("stop");
        }, 15000);

        return (): void => {
            clearTimeout(intervalStopTimeout);
        };
    }, []);

    return (
        <Section>
            <Title>
                Controlled props (start/stop animation and change options)
            </Title>
            <Example>
                <TextLoop interval={interval} children={options} /> in every
                category.
            </Example>
        </Section>
    );
};

const StaggeredExample: React.FunctionComponent = (): JSX.Element => (
    <Section>
        <Title>Staggered (with delay prop and custom styling)</Title>
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
);

enum Sections {
    Base,
    Fast,
    Smooth,
    Variable,
    Masked,
    Controlled,
    Staggered,
}

const App: React.FunctionComponent = (): JSX.Element => {
    const [activeSection, setActiveSection] = useState<Sections>(Sections.Base);

    const mapSectionToComponent = {
        [Sections.Base]: BaseExample,
        [Sections.Fast]: FastExample,
        [Sections.Smooth]: SmoothExample,
        [Sections.Variable]: VariableExample,
        [Sections.Masked]: MaskedExample,
        [Sections.Controlled]: ControlledExample,
        [Sections.Staggered]: StaggeredExample,
    };

    const ExampleSection = mapSectionToComponent[activeSection];
    return (
        <div>
            <Section>
                <Title>Examples</Title>
                <select
                    onChange={(e): void => {
                        setActiveSection(parseInt(e.target.value, 10));
                    }}
                >
                    <option value={Sections.Base}>Default</option>
                    <option value={Sections.Fast}>Fast</option>
                    <option value={Sections.Smooth}>Smooth</option>
                    <option value={Sections.Variable}>Variable</option>
                    <option value={Sections.Masked}>Masked</option>
                    <option value={Sections.Controlled}>Controlled</option>
                    <option value={Sections.Staggered}>Staggered</option>
                </select>
            </Section>
            <ExampleSection />
        </div>
    );
};

export default App;
