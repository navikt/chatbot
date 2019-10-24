import React, { Component } from 'react';
import styled from 'styled-components';
import { render } from 'react-dom';

import Chat from '../../src';

const Outer = styled.div`
    padding: 0;
    margin: 0;
`;

class Demo extends Component {
    render() {
        return (
            <Outer>
                <Chat
                    customerKey='12345'
                    queueKey='Q_CHAT_BOT'
                    configId='c34298fe-3ea4-4d88-9343-c2d4e7bb3e10'
                />
            </Outer>
        );
    }
}

render(<Demo />, document.querySelector('#demo'));