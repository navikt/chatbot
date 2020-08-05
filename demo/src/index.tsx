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
                    customerKey='41155'
                    queueKey='Q_CHAT_BOT'
                    configId='599f9e7c-7f6b-4569-81a1-27202c419953'
                    isOpen={true}
                />
            </Outer>
        );
    }
}

render(<Demo />, document.querySelector('#demo'));
