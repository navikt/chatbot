import React, { Component } from 'react';
import styled from 'styled-components';
import { liten } from '../tema/mediaqueries';
import fridaIkon from '../assets/frida.svg';
import tema from '../tema/tema';
import ToppBar from './ToppBar';
import Interaksjonsvindu from './Interaksjonsvindu';

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
    display: flex;
    flex-direction: column;

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

const FridaKnapp = styled.div`
    width: 100%;
    height: 100%;
`;

type ChatContainerProps = {
    erApen: boolean;
};

export default class ChatContainer extends Component<{}, ChatContainerProps> {
    constructor(props: ChatContainerProps) {
        super(props);
        this.state = {
            erApen: true
        };

        this.apne = this.apne.bind(this);
        this.lukk = this.lukk.bind(this);
    }

    apne(): void {
        this.setState({ erApen: true });
    }

    lukk(): void {
        this.setState({ erApen: false });
    }

    render() {
        return (
            <Container erApen={this.state.erApen}>
                {!this.state.erApen && <FridaKnapp onClick={this.apne} />}
                {this.state.erApen && <ToppBar lukk={() => this.lukk()} />}
                {this.state.erApen && <Interaksjonsvindu />}
            </Container>
        );
    }
}
