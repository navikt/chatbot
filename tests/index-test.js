import React from "react";
import { unmountComponentAtNode } from "react-dom";

import Component from "src/";

describe("Component", () => {
  let node;

  beforeEach(() => {
    node = document.createElement("div");
  });

  afterEach(() => {
    unmountComponentAtNode(node);
  });
});
