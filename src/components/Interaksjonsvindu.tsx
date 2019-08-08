import React, { Component } from 'react';
import styled from 'styled-components';
import tema from '../tema/tema';
import axios from 'axios';
import Snakkeboble from './Snakkeboble';

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
const Tekstomrade = styled.div`
    margin-top: auto;
    display: flex;
    border-top: 1px solid ${tema.farger.tekstfelt};
    height: 20%;
`;
const Tekstfelt = styled.textarea`
    width: 80%;
    border: none;
`;
const Test = styled.div``;

type InteraksjonsvinduProps = {
    sessionId: string;
    sessionIdPure: string;
    requestId: string;
    historie: any[];
};

export default class Interaksjonsvindu extends Component<
    {},
    InteraksjonsvinduProps
> {
    baseUrl = 'https://devapi.puzzel.com/chat/v1';

    constructor(props: InteraksjonsvinduProps) {
        super(props);
        this.state = {
            requestId: '',
            sessionId: '',
            sessionIdPure: '',
            historie: []
        };
    }

    async componentDidMount() {
        if (!localStorage.getItem('config')) {
            let session = await axios.post(`${this.baseUrl}/sessions`, {
                customerKey: '12345',
                queueKey: 'Q_CHAT_BOT',
                nickName: 'test',
                chatId: 'test.name@customer.com',
                languageCode: 'NO',
                denyArchiving: false
            });

            let data: InteraksjonsvinduProps = {
                sessionId: '1234-' + session.data.iqSessionId,
                sessionIdPure: session.data.iqSessionId,
                requestId: session.data.requestId,
                historie: []
            };
            localStorage.setItem('config', JSON.stringify(data));
        }

        const config: InteraksjonsvinduProps = JSON.parse(localStorage.getItem(
            'config'
        ) as string);
        let historie = await axios.get(
            `${this.baseUrl}/sessions/${config.sessionId}/messages/0`
        );
        this.setState({ historie: historie.data });
    }

    render() {
        const { historie } = this.state;
        let historieListe = historie.map(historieItem => {
            if (historieItem.type === 'Message') {
                return (
                    <Snakkeboble key={historieItem.id} Message={historieItem} />
                );
            } else {
                return;
            }
        });
        return (
            <Interaksjon>
                <Chatlog>{historieListe}</Chatlog>
                <Tekstomrade>
                    <Tekstfelt placeholder={'Skriv spørsmålet ditt'} />
                    <Test>
                        <button>Send</button>
                    </Test>
                </Tekstomrade>
            </Interaksjon>
        );
    }
}
