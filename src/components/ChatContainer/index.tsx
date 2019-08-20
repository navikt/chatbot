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

const defaultState: ChatContainerState = {
    erApen: true,
    navn: 'Chatbot Frida',
    historie: [],
    config: loadJSON('config'),
    brukere: [],
    iKo: false,
    sisteMeldingId: 0
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

        this.start = this.start.bind(this);
        this.apne = this.apne.bind(this);
        this.lukk = this.lukk.bind(this);
        this.oppdaterNavn = this.oppdaterNavn.bind(this);
        this.avslutt = this.avslutt.bind(this);
        this.omstart = this.omstart.bind(this);
    }

    render() {
        const { queueKey, customerKey } = this.props;
        return (
            <Container erApen={this.state.erApen} tabIndex={0}>
                {!this.state.erApen && <FridaKnapp onClick={this.apne} />}
                {this.state.erApen && (
                    <ToppBar
                        navn={this.state.navn}
                        lukk={() => this.lukk()}
                        omstart={() => this.omstart()}
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

    async start(tving: boolean = false) {
        if (!this.state.config || tving) {
            await this.hentConfig();
        }
        if (this.state.historie && this.state.historie.length < 1) {
            const historie = await this.hentFullHistorie()!;
            const data: any[] = historie.data;
            this.setState({
                historie: data,
                sisteMeldingId: data[data.length - 1].id
            });
        }

        setInterval(() => this.hentHistorie(this.state.sisteMeldingId), 1000);
    }

    apne(): void {
        this.setState({ erApen: true });
    }

    lukk(): void {
        this.setState({ erApen: false });
    }

    omstart(): void {
        this.setState(defaultState);
        this.start(true);
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
