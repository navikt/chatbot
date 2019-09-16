import React, { Component } from 'react';
import ToppBar from '../ToppBar';
import Interaksjonsvindu, { Bruker, Config } from '../Interaksjonsvindu';
import { Container, FridaKnapp } from './styles';
import { ConnectionConfig } from '../../index';
import axios, { AxiosResponse } from 'axios';
import { loadJSON, saveJSON } from '../../services/localStorageService';
import { Message, SessionCreateResponse } from '../../api/Sessions';
import moment from 'moment';

export type ChatContainerState = {
    erApen: boolean;
    navn?: string | undefined;
    historie: Message[];
    ikkeLastethistorie: Message[];
    brukere: Bruker[];
    config?: Config;
    iKo: boolean;
    sisteMeldingId: number;
    avsluttet: boolean;
    brukereSomSkriver: {
        [userId: number]: number;
    };
    hentHistorie: boolean;
};

const defaultState: ChatContainerState = {
    erApen: true,
    navn: 'Chatbot Frida',
    historie: [],
    ikkeLastethistorie: [],
    config: {
        alive: 0,
        requestId: 0,
        sessionId: '',
        sessionIdPure: ''
    },
    brukere: [],
    iKo: false,
    sisteMeldingId: 0,
    avsluttet: false,
    brukereSomSkriver: {},
    hentHistorie: true
};

export default class ChatContainer extends Component<
    ConnectionConfig,
    ChatContainerState
> {
    baseUrl = 'https://devapi.puzzel.com/chat/v1';
    skriveindikatorTid = 3000;
    hentHistorieIntervall: number;
    lesIkkeLastethistorieIntervall: number;
    constructor(props: ConnectionConfig) {
        super(props);
        this.state = {
            ...defaultState,
            historie: loadJSON('historie') || [],
            config: loadJSON('config'),
            sisteMeldingId: loadJSON('historie')
                ? loadJSON('historie')
                      .slice()
                      .reverse()
                      .find((_historie: any) => _historie.role === 1)
                    ? loadJSON('historie')
                          .slice()
                          .reverse()
                          .find((_historie: any) => _historie.role === 1).id
                    : 0
                : 0
        };

        this.start = this.start.bind(this);
        this.apne = this.apne.bind(this);
        this.lukk = this.lukk.bind(this);
        this.oppdaterNavn = this.oppdaterNavn.bind(this);
        this.avslutt = this.avslutt.bind(this);
        this.omstart = this.omstart.bind(this);
        this.hentConfig = this.hentConfig.bind(this);
        this.hentFullHistorie = this.hentFullHistorie.bind(this);
        this.handterMelding = this.handterMelding.bind(this);
        this.leggTilIHistorie = this.leggTilIHistorie.bind(this);
        this.lesIkkeLastethistorie = this.lesIkkeLastethistorie.bind(this);
    }

    componentDidMount() {
        this.start();
    }

    render() {
        const { queueKey, customerKey } = this.props;
        return (
            <Container
                erApen={this.state.erApen}
                tabIndex={0}
                aria-label={`Samtalevindu: ${this.state.navn}`}
            >
                {!this.state.erApen && <FridaKnapp onClick={this.apne} />}
                {this.state.erApen && (
                    <ToppBar
                        navn={
                            this.state.brukere.some(
                                (bruker: Bruker) => bruker.userType === 'Human'
                            )
                                ? `Chat med NAV`
                                : this.state.navn
                        }
                        lukk={() => this.lukk()}
                        omstart={() => this.omstart()}
                        avslutt={() => this.avslutt()}
                    />
                )}
                <Interaksjonsvindu
                    oppdaterNavn={navn => this.oppdaterNavn(navn)}
                    handterMelding={(melding, oppdater) =>
                        this.handterMelding(melding, oppdater)
                    }
                    lukk={() => this.lukk()}
                    apne={() => this.apne()}
                    vis={this.state.erApen}
                    queueKey={queueKey}
                    customerKey={customerKey}
                    baseUrl={this.baseUrl}
                    historie={this.state.historie}
                    brukere={this.state.brukere}
                    iKo={this.state.iKo}
                    avsluttet={this.state.avsluttet}
                    config={this.state.config!}
                    skriveindikatorTid={this.skriveindikatorTid}
                />
            </Container>
        );
    }

    async start(tving: boolean = false) {
        if (!this.state.config || tving) {
            localStorage.clear();
            sessionStorage.clear();
            await this.hentConfig();
            await this.setState({
                ...defaultState,
                config: loadJSON('config')
            });
        }
        if (this.state.historie && this.state.historie.length < 1) {
            // Henter full historie fra API
            let historie = await this.hentFullHistorie()!;
            let data: any[] = historie.data;
            if (data.length > 0) {
                for (let historie of data) {
                    this.handterMelding(historie, true);
                }
            }
        } else {
            // Har hentet historie fra localStorage
            for (let historie of this.state.historie) {
                this.handterMelding(historie);
            }
        }

        this.hentHistorieIntervall = setInterval(
            () => this.hentHistorie(this.state.sisteMeldingId),
            1000
        );
        this.lesIkkeLastethistorieIntervall = setInterval(
            () => this.lesIkkeLastethistorie(),
            50
        );
    }

    apne(): void {
        this.setState({ erApen: true });
    }

    lukk(): void {
        this.setState({ erApen: false });
    }

    async omstart() {
        await this.avslutt();
        clearInterval(this.hentHistorieIntervall);
        clearInterval(this.lesIkkeLastethistorieIntervall);
        this.start(true);
    }

    oppdaterNavn(navn: string): void {
        if (this.state.navn !== navn) {
            this.setState({ navn });
        }
    }

    async avslutt() {
        if (this.state.config) {
            await axios.delete(
                `${this.baseUrl}/sessions/${this.state.config.sessionId}/${
                    this.state.config.requestId
                }`
            );
        }
    }

    async hentConfig(): Promise<AxiosResponse<SessionCreateResponse>> {
        const session = await axios.post(`${this.baseUrl}/sessions`, {
            customerKey: parseInt(this.props.customerKey),
            queueKey: this.props.queueKey,
            nickName: 'Bruker',
            chatId: 'test.name@customer.com',
            languageCode: 'NO',
            denyArchiving: false
        });

        let data: Config = {
            sessionId: `${this.props.customerKey}-${session.data.iqSessionId}`,
            sessionIdPure: session.data.iqSessionId,
            requestId: session.data.requestId,
            alive: moment(new Date())
                .add(2, 'hours')
                .valueOf()
        };

        saveJSON('config', data);
        this.setState({
            config: data
        });
        return session;
    }

    hentFullHistorie() {
        return axios.get(
            `${this.baseUrl}/sessions/${
                this.state.config!.sessionId
            }/messages/0`
        );
    }

    async hentHistorie(sisteMeldingId: number) {
        if (
            this.state.hentHistorie &&
            this.state.config &&
            !this.state.avsluttet
        ) {
            try {
                const res = await axios.get(
                    `${this.baseUrl}/sessions/${
                        this.state.config.sessionId
                    }/messages/${sisteMeldingId}`
                );
                const data: Message[] = res.data;
                if (data && data.length > 0) {
                    for (let historie of data) {
                        this.setState({
                            ikkeLastethistorie: [
                                ...this.state.ikkeLastethistorie,
                                historie
                            ]
                        });
                    }
                    let fantId = false;
                    let sisteId = 1;
                    while (!fantId) {
                        if (
                            data[data.length - sisteId] &&
                            data[data.length - sisteId].content !== 'TYPE_MSG'
                        ) {
                            fantId = true;
                            this.setState({
                                sisteMeldingId: data[data.length - sisteId].id
                            });
                        } else {
                            sisteId++;
                        }
                    }
                } else {
                    for (let historie of data) {
                        this.handterMelding(historie, true);
                    }
                }
            } catch (e) {
                this.setState({
                    hentHistorie: false
                });
            }
        }
    }

    handterMelding(melding: Message, oppdater: boolean = false) {
        if (melding.type === 'UserInfo') {
            if (
                !this.state.brukere.some(
                    (b: Bruker) => b.userId === melding.userId
                )
            ) {
                this.setState((state: ChatContainerState) => {
                    const brukere = state.brukere.concat({
                        userId: melding.userId,
                        avatarUrl: melding.content.avatarUrl,
                        nickName: melding.nickName,
                        role: melding.role,
                        userType: melding.content.userType,
                        aktiv: true
                    });
                    return {
                        brukere
                    };
                });
            }
            if (melding.content.userType === 'Human') {
                this.setState({
                    iKo: false
                });
            }
        } else if (melding.type === 'Option') {
            for (let i = 0; i < melding.content.length; i++) {
                let m = melding.content[i];
                if (typeof m === 'string') {
                    melding.content[i] = {
                        tekst: m,
                        valgt: false
                    };
                }
            }
        } else if (melding.type === 'OptionResult') {
            const besvart = this.state.historie.filter(
                (_h: any) => _h.id === melding.content.messageId
            )[0];
            const temp = besvart.content.find(
                (a: { tekst: string; valgt: boolean }) =>
                    a.tekst.toString() ===
                    melding.content.optionChoice.toString()
            );
            temp.valgt = true;
        } else if (melding.type === 'Event') {
            if (melding.content === 'USER_DISCONNECTED') {
                this.setState((state: ChatContainerState) => {
                    const brukere = state.brukere.map(bruker => {
                        if (bruker.userId === melding.userId) {
                            bruker.aktiv = false;
                        }
                        return bruker;
                    });
                    return {
                        brukere
                    };
                });
            } else if (melding.content.includes('REQUEST_PUTINQUEUE')) {
                this.setState({
                    iKo: true
                });
            } else if (melding.content === 'REQUEST_DISCONNECTED') {
                this.setState({
                    avsluttet: true
                });
            }
        }
        this.leggTilIHistorie(melding, oppdater);
    }

    leggTilIHistorie(melding: Message, oppdater: boolean = false) {
        if (
            oppdater &&
            !this.state.historie.some(
                (historie: Message) => historie.id === melding.id
            )
        ) {
            console.log(`Legger til i historie: ${melding.type}`);
            console.log(melding);
            this.setState({
                historie: [...this.state.historie, melding]
            });
        }

        saveJSON('historie', this.state.historie);
    }

    lesIkkeLastethistorie() {
        const now = moment();
        if (this.state.ikkeLastethistorie.length > 0) {
            const [historie, ...resten] = this.state.ikkeLastethistorie;

            if (
                historie.type === 'Message' ||
                historie.type === 'Option' ||
                historie.type === 'Evaluation'
            ) {
                const tid = this.state.brukereSomSkriver[historie.userId];
                if (this.state.brukereSomSkriver[historie.userId]) {
                    if (now.valueOf() - tid >= this.skriveindikatorTid) {
                        this.setState(
                            (state: ChatContainerState) => {
                                const brukereSomSkriver = {
                                    ...state.brukereSomSkriver
                                };
                                brukereSomSkriver[
                                    historie.userId
                                ] = now.valueOf();
                                return {
                                    brukereSomSkriver,
                                    ikkeLastethistorie: resten
                                };
                            },
                            () => {
                                this.handterMelding(historie, true);
                            }
                        );
                    }
                } else {
                    this.setState((state: ChatContainerState) => {
                        const brukereSomSkriver = {
                            ...state.brukereSomSkriver
                        };
                        brukereSomSkriver[historie.userId] = now.valueOf();
                        return {
                            brukereSomSkriver
                        };
                    });
                }
            } else {
                this.setState(
                    {
                        ikkeLastethistorie: resten
                    },
                    () => {
                        this.handterMelding(historie, true);
                    }
                );
            }
        }
    }
}
