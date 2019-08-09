import React, { Component } from 'react';
import styled from 'styled-components';
import { liten } from '../tema/mediaqueries';
import fridaIkon from '../assets/frida.svg';
import tema from '../tema/tema';
import ToppBar from './ToppBar';
import Interaksjonsvindu from './Interaksjonsvindu';

const Container = styled.div`
    width: ${(props: ChatContainerState) =>
        props.erApen ? tema.bredde : '68px'};
    height: ${(props: ChatContainerState) =>
        props.erApen ? tema.hoyde : '68px'};
    border-radius: ${(props: ChatContainerState) =>
        props.erApen ? '0' : '50%'};
    position: fixed;
    bottom: 50px;
    right: 50px;
    background: ${(props: ChatContainerState) =>
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
        width: ${(props: ChatContainerState) =>
            props.erApen ? 'auto' : '68px'};
        height: ${(props: ChatContainerState) =>
            props.erApen ? 'auto' : '68px'};
        border-radius: ${(props: ChatContainerState) =>
            props.erApen ? '0' : '50%'};
        top: ${(props: ChatContainerState) => (props.erApen ? '0' : undefined)};
        right: ${(props: ChatContainerState) => (props.erApen ? '0' : '20px')};
        bottom: ${(props: ChatContainerState) => (props.erApen ? '0' : '20px')};
        left: ${(props: ChatContainerState) =>
            props.erApen ? '0' : undefined};
    }
`;

const FridaKnapp = styled.div`
    width: 100%;
    height: 100%;
`;

type ChatContainerState = {
    erApen: boolean;
    navn?: string | undefined;
};

export default class ChatContainer extends Component<{}, ChatContainerState> {
    constructor(props: ChatContainerState) {
        super(props);
        this.state = {
            erApen: true,
            navn: 'Chatbot Frida'
        };

        this.apne = this.apne.bind(this);
        this.lukk = this.lukk.bind(this);
        this.oppdaterNavn = this.oppdaterNavn.bind(this);
    }

    render() {
        return (
            <Container erApen={this.state.erApen}>
                {!this.state.erApen && <FridaKnapp onClick={this.apne} />}
                {this.state.erApen && (
                    <ToppBar navn={this.state.navn} lukk={() => this.lukk()} />
                )}
                {this.state.erApen && (
                    <Interaksjonsvindu
                        oppdaterNavn={navn => this.oppdaterNavn(navn)}
                    />
                )}
            </Container>
        );
    }

    apne(): void {
        this.setState({ erApen: true });
    }

    lukk(): void {
        this.setState({ erApen: false });
    }

    oppdaterNavn(navn: string): void {
        console.log(this.state.navn);
        if (this.state.navn !== navn) {
            this.setState({ navn });
        }
    }
}
