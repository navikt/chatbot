import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import NAVChatBot from '@navikt/nav-chatbot';
import styled from 'styled-components';

const Outer = styled.div`
    ´padding: 0;
    margin: 0;
`;

const NAVBackdrop = styled.iframe`
    height: 100vh;
    width: 100vw;
    border: none;
`;

ReactDOM.render(
    <Outer>
        <NAVBackdrop src='https://familie.nav.no/' title='NAV Famile' />
        <NAVChatBot customerKey='12345' queueKey='Q_CHAT_BOT' />
    </Outer>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
