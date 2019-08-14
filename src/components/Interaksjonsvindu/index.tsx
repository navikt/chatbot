import React, { ChangeEvent, Component, FormEvent } from 'react';
import axios from 'axios';
import Kommunikasjon, { Beskjed } from '../Kommunikasjon';
import Eventviser from '../Eventviser/';
import { Message, SessionCreateResponse } from '../../api/Sessions';
import {
    Chatlog,
    Interaksjon,
    SendKnappOgTeller,
    Tekstfelt,
    Tekstomrade,
    Teller
} from './styles';
import moment from 'moment';
import Flervalg from '../Flervalg';
import Knapp from '../Knapp';
import Alertstripe from '../Alertstripe';
import { ConnectionConfig } from '../../index';

export interface Bruker {
    userId: number;
    avatarUrl: string;
    userType: string;
    nickName: string;
    role: number;
    aktiv: boolean;
}

type InteraksjonsvinduProps = {
    oppdaterNavn: (navn: string) => void;
    apne: () => void;
    lukk: () => void;
    vis: boolean;
};

type InteraksjonsvinduState = {
    sessionId: string;
    sessionIdPure: string;
    requestId: number;
    historie: any[];
    melding: string;
    brukere: Bruker[];
    sendt: boolean;
    feil: boolean;
};

interface Config {
    sessionId: string;
    sessionIdPure: string;
    requestId: number;
    alive: number;
}

export default class Interaksjonsvindu extends Component<
    InteraksjonsvinduProps & ConnectionConfig,
    InteraksjonsvinduState
> {
    baseUrl = 'https://devapi.puzzel.com/chat/v1';
    formRef: HTMLFormElement | null;
    scrollEl: HTMLElement | null;

    constructor(props: InteraksjonsvinduProps & ConnectionConfig) {
        super(props);
        this.state = {
            requestId: 0,
            sessionId: '',
            sessionIdPure: '',
            historie: [],
            melding: '',
            brukere: [],
            sendt: false,
            feil: false
        };

        this.init = this.init.bind(this);
        this.sendMelding = this.sendMelding.bind(this);
        this.oppdaterHistorie = this.oppdaterHistorie.bind(this);
        this.lastHistorie = this.lastHistorie.bind(this);
        this.velg = this.velg.bind(this);
    }

    componentDidMount() {
        this.init();
    }

    render() {
        if (!this.props.vis) {
            return null;
        } else {
            const { historie } = this.state;
            let historieListe = historie.map((historieItem: Beskjed) => {
                return this.lastHistorie(historieItem);
            });
            const harAktiveBrukere =
                this.state.brukere.filter((bruker: Bruker) => bruker.aktiv)
                    .length === this.state.brukere.length;

            return (
                <Interaksjon>
                    {this.state.melding === 'info' && (
                        <Alertstripe type='info'>
                            Du blir nå satt over til en veileder.
                        </Alertstripe>
                    )}
                    {!harAktiveBrukere && (
                        <Alertstripe type='advarsel'>
                            Det er ikke flere aktive brukere i kanalen.
                        </Alertstripe>
                    )}
                    {this.state.melding === 'suksess' && (
                        <Alertstripe type='suksess'>Flott.</Alertstripe>
                    )}
                    {(this.state.melding === 'feil' || this.state.feil) && (
                        <Alertstripe type='feil'>
                            En feil har oppstått.
                        </Alertstripe>
                    )}
                    <Chatlog role='region' aria-live='polite'>
                        {historieListe}
                    </Chatlog>
                    <Tekstomrade
                        ref={el => (this.formRef = el)}
                        onSubmit={e => this.sendMelding(e)}
                    >
                        <Tekstfelt
                            onKeyDown={e => this.handleKeyDown(e)}
                            onChange={e => this.handleChange(e)}
                            placeholder={'Skriv spørsmålet ditt'}
                        />
                        <SendKnappOgTeller>
                            <Knapp
                                disabled={this.state.melding.length > 200}
                                aktiv={this.state.sendt}
                            >
                                {this.state.sendt ? 'Sendt' : 'Send'}
                            </Knapp>
                            <Teller error={this.state.melding.length > 200}>
                                {this.state.melding.length} / 200
                            </Teller>
                        </SendKnappOgTeller>
                    </Tekstomrade>
                </Interaksjon>
            );
        }
    }

    async init(reset: boolean = false) {
        if (!localStorage.getItem('config') || reset) {
            let session: { data: SessionCreateResponse } = await axios.post(
                `${this.baseUrl}/sessions`,
                {
                    customerKey: parseInt(this.props.customerKey),
                    queueKey: this.props.queueKey,
                    nickName: 'Bruker',
                    chatId: 'test.name@customer.com',
                    languageCode: 'NO',
                    denyArchiving: false
                }
            );

            let data: Config = {
                sessionId: '1234-' + session.data.iqSessionId,
                sessionIdPure: session.data.iqSessionId,
                requestId: session.data.requestId,
                alive: moment(new Date())
                    .add(2, 'hours')
                    .valueOf()
            };
            localStorage.setItem('config', JSON.stringify(data));
        }

        const config: Config = JSON.parse(localStorage.getItem(
            'config'
        ) as string);

        if (moment().valueOf() >= moment(config.alive).valueOf()) {
            console.log('Get new config');
            // TODO: Get new config
        }

        this.oppdaterHistorie();

        setInterval(async () => {
            if (!this.state.feil) {
                this.oppdaterHistorie();
            }
        }, 1000);

        sessionStorage.removeItem('brukereSett');
        sessionStorage.removeItem('sisteHistorie');
    }

    async sendMelding(e?: FormEvent<HTMLFormElement>) {
        if (e) {
            e.preventDefault();
        }
        if (
            this.state.melding.trim() &&
            this.state.melding.trim().length <= 200
        ) {
            const config: InteraksjonsvinduState = JSON.parse(
                localStorage.getItem('config') as string
            );

            try {
                await axios.post(
                    `${this.baseUrl}/sessions/${config.sessionId}/messages`,
                    {
                        nickName: 'Bruker',
                        content: this.state.melding.trim(),
                        type: 'Message'
                    }
                );
            } catch (e) {
                console.error(e);
                this.setState({
                    feil: true
                });
            }

            this.oppdaterHistorie();
            if (this.formRef) {
                this.formRef.reset();
                this.setState({
                    sendt: true,
                    melding: ''
                });
                this.scrollToBottom();
                setTimeout(() => {
                    this.setState({
                        sendt: false
                    });
                }, 3000);
            }
        }
    }

    oppdaterHistorie() {
        const config: Config = JSON.parse(localStorage.getItem(
            'config'
        ) as string);
        axios
            .get(`${this.baseUrl}/sessions/${config.sessionId}/messages/0`)
            .then(res => {
                const historie = res.data as Message[];
                const sisteHistorie = sessionStorage.getItem(
                    'sisteHistorie'
                ) as string;
                if (
                    sisteHistorie ===
                    JSON.stringify(historie[historie.length - 1].id)
                ) {
                    return;
                }
                for (let _historie of historie) {
                    if (_historie.type === 'Option') {
                        _historie.content = _historie.content.map((e: any) => ({
                            tekst: e,
                            valgt: false
                        }));
                    } else if (_historie.type === 'OptionResult') {
                        const answered = historie.filter((_h: any) => {
                            return _h.id === _historie.content.messageId;
                        })[0];
                        const temp = answered.content.find(
                            (a: { tekst: string; valgt: boolean }) => {
                                return (
                                    a.tekst.toString() ===
                                    _historie.content.optionChoice.toString()
                                );
                            }
                        );
                        temp.valgt = true;
                    }
                    if (_historie.type === 'Event') {
                        if (_historie.content === 'USER_CONNECTED') {
                            this.props.oppdaterNavn(_historie.nickName);
                        } else if (_historie.content === 'USER_DISCONNECTED') {
                            const bruker = this.state.brukere.filter(
                                (_bruker: Bruker) =>
                                    _bruker.userId === _historie.userId
                            )[0];
                            if (bruker) {
                                bruker.aktiv = false;
                            }
                        }
                    } else if (_historie.type === 'UserInfo') {
                        // TODO: Sjekk duplikater
                        if (
                            this.state.brukere.filter(
                                (_bruker: Bruker) =>
                                    _bruker.userId === _historie.userId
                            ).length === 0 &&
                            _historie.content.userType
                        ) {
                            this.setState({
                                brukere: [
                                    ...this.state.brukere,
                                    {
                                        userId: _historie.userId,
                                        avatarUrl: _historie.content.avatarUrl,
                                        nickName: _historie.nickName,
                                        role: _historie.role,
                                        userType: _historie.content.userType,
                                        aktiv: true
                                    }
                                ]
                            });
                        }
                    }
                }
                this.setState({ historie });
                this.scrollToBottom();
                sessionStorage.setItem(
                    'sisteHistorie',
                    JSON.stringify(res.data[res.data.length - 1].id)
                );
            })
            .catch(e => {
                console.error(e);
                this.setState({
                    feil: true
                });
            });
    }

    lastHistorie(historie: Beskjed) {
        switch (historie.type) {
            case 'Message':
            case 'OptionResult':
                return (
                    <div key={`el-${historie.id}`}>
                        <Kommunikasjon
                            key={historie.id}
                            Beskjed={historie}
                            brukere={this.state.brukere}
                        />
                        <div
                            key={`scroll-el-${historie.id}`}
                            ref={e => (this.scrollEl = e)}
                            aria-hidden='true'
                        />
                    </div>
                );
            case 'Event':
                return (
                    <div key={`el-${historie.id}`}>
                        <Eventviser Beskjed={historie} />
                        <div
                            key={`scroll-el-${historie.id}`}
                            ref={e => (this.scrollEl = e)}
                            aria-hidden='true'
                        />
                    </div>
                );
            case 'Option':
                return (
                    <div key={`el-${historie.id}`}>
                        <Flervalg
                            beskjed={historie}
                            harBlittBesvart={historie.content.find(
                                (b: { tekst: string; valgt: boolean }) =>
                                    b.valgt
                            )}
                            velg={(messageId: number, valg: string) =>
                                this.velg(messageId, valg)
                            }
                        />
                        <div
                            key={`scroll-el-${historie.id}`}
                            ref={e => (this.scrollEl = e)}
                            aria-hidden='true'
                        />
                    </div>
                );
            default:
                return;
        }
    }

    handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
        this.setState({ melding: e.target.value });
    }

    handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.keyCode === 13 && !e.shiftKey && this.formRef) {
            e.preventDefault();
            this.sendMelding();
        }
    }

    scrollToBottom() {
        if (this.scrollEl) {
            this.scrollEl.scrollIntoView({ behavior: 'smooth' });
        }
    }

    velg(messageId: number, valg: string) {
        const config: Config = JSON.parse(localStorage.getItem(
            'config'
        ) as string);
        axios
            .post(`${this.baseUrl}/sessions/${config.sessionId}/messages`, {
                nickName: 'Bruker',
                type: 'OptionResult',
                content: {
                    messageId: messageId,
                    optionChoice: valg,
                    cancelled: false
                }
            })
            .then(() => {
                this.oppdaterHistorie();
            });
    }
}
