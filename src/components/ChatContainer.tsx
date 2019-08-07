import React, { Component } from "react";
import styled from "styled-components";
import { liten } from "../tema/mediaqueries";

type ChatContainerProps = {
  erApen: boolean;
};

const Container = styled.div`
  width: ${(props: ChatContainerProps) => (props.erApen ? "400px" : "68px")};
  height: ${(props: ChatContainerProps) => (props.erApen ? "568px" : "68px")};
  border-radius: ${(props: ChatContainerProps) => (props.erApen ? "0" : "50%")};
  position: fixed;
  bottom: 50px;
  right: 50px;
  background: red;
  transition: all 300ms cubic-bezier(0.86, 0, 0.07, 1);

  ${liten} {
    width: ${(props: ChatContainerProps) => (props.erApen ? "auto" : "68px")};
    height: ${(props: ChatContainerProps) => (props.erApen ? "auto" : "68px")};
    border-radius: ${(props: ChatContainerProps) =>
      props.erApen ? "0" : "50%"};
    top: ${(props: ChatContainerProps) => (props.erApen ? "0" : undefined)};
    right: ${(props: ChatContainerProps) => (props.erApen ? "0" : "20px")};
    bottom: ${(props: ChatContainerProps) => (props.erApen ? "0" : "20px")};
    left: ${(props: ChatContainerProps) => (props.erApen ? "0" : undefined)};
  }
`;

export default class ChatContainer extends Component<{}, ChatContainerProps> {
  constructor(props: ChatContainerProps) {
    super(props);
    this.state = {
      erApen: false
    };

    this.open = this.open.bind(this);
  }

  open() {
    this.setState({ erApen: true });
  }

  render() {
    return <Container onClick={this.open} erApen={this.state.erApen} />;
  }
}
