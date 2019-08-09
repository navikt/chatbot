import React, { ChangeEvent, Component, FormEvent } from 'react';
import styled from 'styled-components';
import tema from '../tema/tema';
import axios from 'axios';
import Kommunikasjon, { Beskjed } from './Kommunikasjon';
import Knapp from './Knapp';
import Eventviser from './Eventviser';
import { Message, SessionCreateResponse } from '../api/Sessions';

interface Bruker {
    userId: number;
    avatarUrl: string;
    userType: string;
    nickName: string;
    role: number;
    harBlittVist: boolean;
}

const Interaksjon = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
`;
const Chatlog = styled.div`
    height: 100%;
    overflow-y: scroll;
    padding: 15px;
`;
const Tekstomrade = styled.form`
    margin-top: auto;
    display: flex;
    border-top: 1px solid ${tema.farger.tekstfelt};
    height: 20%;
    padding: 10px;
    align-items: center;
`;
const Tekstfelt = styled.textarea`
    width: 100%;
    height: 100%;
    resize: none;
    margin-right: 5px;
    border: none;
    font-size: ${tema.storrelser.tekst.generell};
    font-family: ${tema.tekstFamilie};
    scroll-behavior: smooth;

    ::placeholder {
        color: ${tema.farger.tekstfelt};
    }
`;
const SendKnapp = styled(Knapp)`
    margin-left: auto;
`;

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

            let data: InteraksjonsvinduState = {
                sessionId: '1234-' + session.data.iqSessionId,
                sessionIdPure: session.data.iqSessionId,
                requestId: session.data.requestId,
                historie: [],
                melding: '',
                brukere: []
            };
            localStorage.setItem('config', JSON.stringify(data));
        }

        this.oppdaterHistorie();

        setInterval(async () => {
            this.oppdaterHistorie();
        }, 1000);
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
        const config: InteraksjonsvinduState = JSON.parse(localStorage.getItem(
            'config'
        ) as string);

        axios
            .get(`${this.baseUrl}/sessions/${config.sessionId}/messages/0`)
            .then(res => {
                const historie = res.data as Message[];
                for (let _historie of historie) {
                    switch (_historie.type) {
                        case 'Event':
                            if (_historie.content === 'USER_CONNECTED') {
                                this.props.oppdaterNavn(_historie.nickName);
                            }
                        case 'UserInfo':
                            if (
                                this.state.brukere.filter(
                                    (bruker: Bruker) =>
                                        bruker.userId === _historie.userId
                                ).length < 1 &&
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
                                            userType:
                                                _historie.content.userType,
                                            harBlittVist: false
                                        }
                                    ]
                                });
                            }
                    }
                }
                this.setState({ historie });
                this.scrollToBottom();
            });
    }

    lastHistorie(historie: Beskjed) {
        switch (historie.type) {
            case 'Message':
                return (
                    <div key={`el-${historie.id}`}>
                        <Kommunikasjon
                            visBilde={true}
                            key={historie.id}
                            Beskjed={historie}
                        />
                        <div
                            key={`scroll-el-${historie.id}`}
                            ref={e => (this.scrollEl = e)}
                        />
                    </div>
                );
            case 'Event':
                return (
                    <div key={`el-${historie.id}`}>
                        <Eventviser visBilde={false} Beskjed={historie} />
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
