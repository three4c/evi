import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import App from "./App";

describe("<App />", () => {
  it("Snapshot", () => {
    expect(render(<App />).asFragment()).toMatchSnapshot();
  });
});
