import React, { Component } from 'react';
import styled from 'styled-components';
import { liten } from '../tema/mediaqueries';
import fridaIkon from '../assets/frida.svg';
import tema from '../tema/tema';

type ChatContainerProps = {
    erApen: boolean;
};

const Container = styled.div`
    width: ${(props: ChatContainerProps) =>
        props.erApen ? tema.bredde : '68px'};
    height: ${(props: ChatContainerProps) =>
        props.erApen ? tema.hoyde : '68px'};
    border-radius: ${(props: ChatContainerProps) =>
        props.erApen ? '0' : '50%'};
    position: fixed;
    bottom: 50px;
    right: 50px;
    background: ${(props: ChatContainerProps) =>
        props.erApen
            ? '#fff'
            : `transparent url('data:image/svg+xml;base64,${window.btoa(
                  fridaIkon
              )}') no-repeat center center`};
    background-size: 100%;
    transition: all 300ms cubic-bezier(0.86, 0, 0.07, 1);

    ${liten} {
        width: ${(props: ChatContainerProps) =>
            props.erApen ? 'auto' : '68px'};
        height: ${(props: ChatContainerProps) =>
            props.erApen ? 'auto' : '68px'};
        border-radius: ${(props: ChatContainerProps) =>
            props.erApen ? '0' : '50%'};
        top: ${(props: ChatContainerProps) => (props.erApen ? '0' : undefined)};
        right: ${(props: ChatContainerProps) => (props.erApen ? '0' : '20px')};
        bottom: ${(props: ChatContainerProps) => (props.erApen ? '0' : '20px')};
        left: ${(props: ChatContainerProps) =>
            props.erApen ? '0' : undefined};
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
