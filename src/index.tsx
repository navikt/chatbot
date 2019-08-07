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
`;

export default class Chat extends Component {
    render() {
        return (
            <ThemeProvider theme={tema}>
                <BorderBox>
                    <ChatContainer />
                </BorderBox>
            </ThemeProvider>
        );
    }
}
