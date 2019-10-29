import React from "react";
import { render, cleanup } from "@testing-library/react";
import TextLoop from "./TextLoop";

afterEach(() => {
    cleanup();
});

describe("TextLoop Tests", () => {
    it("should render without errors", () => {
        render(<TextLoop />);
    });
});
