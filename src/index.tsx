import React, { Component } from "react";
import styled, { ThemeProvider } from "styled-components";
import theme from "./theme/theme";
import ChatContainer from "./components/ChatContainer";

const BorderBox = styled.div`
  box-sizing: border-box;

  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }
`;

export default class Chat extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <BorderBox>
          <ChatContainer />
        </BorderBox>
      </ThemeProvider>
    );
  }
}
