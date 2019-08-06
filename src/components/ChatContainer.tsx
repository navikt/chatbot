import React, { Component } from "react";
import styled from "styled-components";

type ChatContainerProps = {
  isOpen: boolean;
};

const Test = styled.div`
  width: ${(props: ChatContainerProps) => (props.isOpen ? "400px" : "68px")};
  height: ${(props: ChatContainerProps) => (props.isOpen ? "568px" : "68px")};
  border-radius: ${(props: ChatContainerProps) => (props.isOpen ? "0" : "50%")};
  position: fixed;
  bottom: 50px;
  right: 50px;
  background: red;
  transition: all 300ms cubic-bezier(0.86, 0, 0.07, 1);
`;

export default class ChatContainer extends Component<{}, ChatContainerProps> {
  static defaultProps = {
    isOpen: false
  };

  constructor(props: ChatContainerProps) {
    super(props);
    this.state = {
      isOpen: false
    };

    this.open = this.open.bind(this);
  }

  open() {
    this.setState({ isOpen: true });
  }

  render() {
    return <Test onClick={this.open} isOpen={this.state.isOpen} />;
  }
}
