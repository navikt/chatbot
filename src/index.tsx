import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import React, { Component } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import ChatContainer from './components/ChatContainer';

import tema from './tema/tema';

const VERSION = require('../package.json').version;

const Global = styled.div`
    box-sizing: border-box;
    font-family: ${tema.tekstFamilie};
    font-size: ${tema.storrelser.tekst.generell};

    *,
    *:before,
    *:after {
        box-sizing: inherit;
    }

    *:focus {
        outline: none;
        box-shadow: 0 0 0 3px #005b82;
    }
`;

export type ConnectionConfig = {
    queueKey: string;
    customerKey: string;
    evaluationMessage?: string;
};

export default class Chat extends Component<ConnectionConfig, {}> {
    constructor(props: ConnectionConfig) {
        super(props);
        console.info(`Chatbot Frida v${VERSION}`);
    }

    render() {
        const { queueKey, customerKey, evaluationMessage } = this.props;
        return (
            <ThemeProvider theme={tema}>
                <Global tabIndex={-1}>
                    <ChatContainer
                        customerKey={customerKey}
                        queueKey={queueKey}
                        evaluationMessage={evaluationMessage}
                    />
                </Global>
            </ThemeProvider>
        );
    }
}
