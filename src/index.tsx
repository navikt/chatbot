import React, { Component } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import ChatContainer from './components/ChatContainer';

import tema from './tema/tema';

const BorderBox = styled.div`
    box-sizing: border-box;

    *,
    *:before,
    *:after {
        box-sizing: inherit;
    }

    *:focus {
        outline: none;
        box-shadow: 0 0 0 3px #254b6d;
    }
`;

export type ConnectionConfig = {
    queueKey: string;
    customerKey: string;
};

export default class Chat extends Component<ConnectionConfig, {}> {
    constructor(props: ConnectionConfig) {
        super(props);
    }

    render() {
        const { queueKey, customerKey } = this.props;
        return (
            <ThemeProvider theme={tema}>
                <BorderBox>
                    <ChatContainer
                        customerKey={customerKey}
                        queueKey={queueKey}
                    />
                </BorderBox>
            </ThemeProvider>
        );
    }
}
