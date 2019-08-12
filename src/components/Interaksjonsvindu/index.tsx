import React, { ChangeEvent, Component, FormEvent } from 'react';
import axios from 'axios';
import Kommunikasjon, { Beskjed } from '../Kommunikasjon';
import Eventviser from '../Eventviser/';
import { Message, SessionCreateResponse } from '../../api/Sessions';
import {
    Chatlog,
    Interaksjon,
    SendKnapp,
    Tekstfelt,
    Tekstomrade
} from './styles';
import moment from 'moment';

export interface Bruker {
    userId: number;
    avatarUrl: string;
    userType: string;
    nickName: string;
    role: number;
}

type InteraksjonsvinduProps = {
    oppdaterNavn: (navn: string) => void;
};

type InteraksjonsvinduState = {
    sessionId: string;
    sessionIdPure: string;
    requestId: number;
    historie: any[];
    melding: string;
    brukere: Bruker[];
};

interface Config {
    sessionId: string;
    sessionIdPure: string;
    requestId: number;
    alive: number;
}

export default class Interaksjonsvindu extends Component<
    InteraksjonsvinduProps,
    InteraksjonsvinduState
> {
    baseUrl = 'https://devapi.puzzel.com/chat/v1';
    formRef: HTMLFormElement | null;
    scrollEl: HTMLElement | null;

    constructor(props: InteraksjonsvinduProps) {
        super(props);
        this.state = {
            requestId: 0,
            sessionId: '',
            sessionIdPure: '',
            historie: [],
            melding: '',
            brukere: []
        };

        this.sendMelding = this.sendMelding.bind(this);
        this.oppdaterHistorie = this.oppdaterHistorie.bind(this);
        this.lastHistorie = this.lastHistorie.bind(this);
    }

    async componentDidMount() {
        if (!localStorage.getItem('config')) {
            let session: { data: SessionCreateResponse } = await axios.post(
                `${this.baseUrl}/sessions`,
                {
                    customerKey: '12345',
                    queueKey: 'Q_CHAT_BOT',
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
            this.oppdaterHistorie();
        }, 1000);

        sessionStorage.removeItem('brukereSett');
        sessionStorage.removeItem('sisteHistorie');
    }

    render() {
        const { historie } = this.state;
        let historieListe = historie.map((historieItem: Beskjed) => {
            return this.lastHistorie(historieItem);
        });

        return (
            <Interaksjon>
                <Chatlog>{historieListe}</Chatlog>
                <Tekstomrade
                    ref={el => (this.formRef = el)}
                    onSubmit={e => this.sendMelding(e)}
                >
                    <Tekstfelt
                        onKeyDown={e => this.handleKeyDown(e)}
                        onChange={e => this.handleChange(e)}
                        placeholder={'Skriv spørsmålet ditt'}
                    />
                    <SendKnapp>Send</SendKnapp>
                </Tekstomrade>
            </Interaksjon>
        );
    }

    async sendMelding(e?: FormEvent<HTMLFormElement>) {
        if (e) {
            e.preventDefault();
        }
        if (this.state.melding.trim()) {
            const config: InteraksjonsvinduState = JSON.parse(
                localStorage.getItem('config') as string
            );

            await axios.post(
                `${this.baseUrl}/sessions/${config.sessionId}/messages`,
                {
                    nickName: 'Bruker',
                    content: this.state.melding.trim(),
                    type: 'Message'
                }
            );

            this.oppdaterHistorie();
            if (this.formRef) {
                this.formRef.reset();
                this.scrollToBottom();
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
                    switch (_historie.type) {
                        case 'Event':
                            if (_historie.content === 'USER_CONNECTED') {
                                this.props.oppdaterNavn(_historie.nickName);
                            }
                            if (_historie.content === 'TYPE_MSG') {
                                console.log('Agent is typing');
                            }
                        case 'UserInfo':
                            // TODO: Sjekk duplikater
                            if (
                                this.state.brukere.filter(
                                    (bruker: Bruker) =>
                                        bruker.userId === _historie.userId
                                ).length === 0 &&
                                _historie.content.userType
                            ) {
                                this.setState({
                                    brukere: [
                                        ...this.state.brukere,
                                        {
                                            userId: _historie.userId,
                                            avatarUrl:
                                                _historie.content.avatarUrl,
                                            nickName: _historie.nickName,
                                            role: _historie.role,
                                            userType: _historie.content.userType
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
            });
    }

    lastHistorie(historie: Beskjed) {
        switch (historie.type) {
            case 'Message':
                return (
                    <div key={`el-${historie.id}`}>
                        <Kommunikasjon key={historie.id} Beskjed={historie} />
                        <div
                            key={`scroll-el-${historie.id}`}
                            ref={e => (this.scrollEl = e)}
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
}
