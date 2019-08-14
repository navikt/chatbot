import React, { Component } from 'react';
import ToppBar from '../ToppBar';
import Interaksjonsvindu, { Config } from '../Interaksjonsvindu';
import { Container, FridaKnapp } from './styles';
import { ConnectionConfig } from '../../index';
import axios from 'axios';

export type ChatContainerState = {
    erApen: boolean;
    navn?: string | undefined;
};

export default class ChatContainer extends Component<
    ConnectionConfig,
    ChatContainerState
> {
    baseUrl = 'https://devapi.puzzel.com/chat/v1';
    constructor(props: ConnectionConfig) {
        super(props);
        this.state = {
            erApen: true,
            navn: 'Chatbot Frida'
        };

        this.apne = this.apne.bind(this);
        this.lukk = this.lukk.bind(this);
        this.oppdaterNavn = this.oppdaterNavn.bind(this);
        this.avslutt = this.avslutt.bind(this);
    }

    render() {
        const { queueKey, customerKey } = this.props;
        return (
            <Container erApen={this.state.erApen}>
                {!this.state.erApen && <FridaKnapp onClick={this.apne} />}
                {this.state.erApen && (
                    <ToppBar
                        navn={this.state.navn}
                        lukk={() => this.lukk()}
                        avslutt={() => this.avslutt()}
                    />
                )}
                <Interaksjonsvindu
                    oppdaterNavn={navn => this.oppdaterNavn(navn)}
                    lukk={() => this.lukk()}
                    apne={() => this.apne()}
                    vis={this.state.erApen}
                    queueKey={queueKey}
                    customerKey={customerKey}
                    baseUrl={this.baseUrl}
                />
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
        if (this.state.navn !== navn) {
            this.setState({ navn });
        }
    }

    avslutt(): void {
        const config: Config = JSON.parse(localStorage.getItem(
            'config'
        ) as string);
        axios
            .delete(
                `${this.baseUrl}/sessions/${config.sessionId}/${
                    config.requestId
                }`
            )
            .then(res => {
                console.log(res);
            });
    }
}
