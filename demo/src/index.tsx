import React, { Component } from 'react';
import styled from 'styled-components';
import { render } from 'react-dom';

import Chat from '../../src';

const Outer = styled.div`
    padding: 0;
    margin: 0;
`;

const NAVBackdrop = styled.iframe`
    height: 100vh;
    width: 100vw;
    border: none;
`;

class Demo extends Component {
    render() {
        return (
            <Outer>
                <NAVBackdrop src='https://familie.nav.no/' title='NAV Famile' />
                <Chat
                    customerKey='41155'
                    queueKey='Q_CHAT_BOT'
                    configId='599f9e7c-7f6b-4569-81a1-27202c419953'
                />
            </Outer>
        );
    }
}

render(<Demo />, document.querySelector('#demo'));
