import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import React, { Component } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import ChatContainer from './components/ChatContainer';

import tema from './tema/tema';

const Global = styled.div`
    box-sizing: border-box;
    font-family: ${tema.tekstFamilie};
    font-size: ${tema.storrelser.tekst.generell};

    *,
    *:before,
    *:after {
        box-sizing: inherit;
    }

    &:focus {
        outline: none;
    }

    *:focus {
        outline: none;
        box-shadow: 0 0 0 3px #005b82;
    }
`;

export type ConnectionConfig = {
    queueKey: string;
    customerKey: string;
    configId: string;
    isOpen?: boolean;
    evaluationMessage?: string;
};

export default class Chat extends Component<ConnectionConfig, {}> {
    render() {
        const {
            queueKey,
            customerKey,
            configId,
            isOpen,
            evaluationMessage,
        } = this.props;
        return (
            <ThemeProvider theme={tema}>
                <Global tabIndex={-1}>
                    <ChatContainer
                        customerKey={customerKey}
                        queueKey={queueKey}
                        configId={configId}
                        evaluationMessage={evaluationMessage}
                        isOpen={isOpen}
                    />
                </Global>
            </ThemeProvider>
        );
    }
}
