import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import React, { Component } from 'react';
import { ThemeProvider } from 'styled-components';
import ChatContainer from './components/ChatContainer';

import tema from './tema/tema';

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
                <ChatContainer
                    customerKey={customerKey}
                    queueKey={queueKey}
                    configId={configId}
                    evaluationMessage={evaluationMessage}
                    isOpen={isOpen}
                />
            </ThemeProvider>
        );
    }
}
