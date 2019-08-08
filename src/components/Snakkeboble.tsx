import React, { Component } from 'react';
import styled from 'styled-components';
import MetaInfo from './MetaInfo';
import tema from '../tema/tema';

// arguments: null
// content: "Jeg heter Frida og er en chatbot."
// id: 776104
// nickName: "Net Nordic"
// role: 1
// sent: "2019-08-08T12:22:35.417"
// type: "Message"
// userId: 35166

type Message = {
    arguments: any[] | null;
    content: string;
    id: number;
    nickName: string;
    role: 0 | 1;
    sent: string;
    type: 'Message';
    userId: number;
};

type SnakkebobleProps = {
    Message: Message;
};

type SnakkebobleState = {
    side: 'VENSTRE' | 'HOYRE';
};

const Konteiner = styled.div`
    display: flex;
    flex-direction: column;
`;

const Test = styled.div`
    display: flex;
`;

const Test2 = styled.div`
    font-family: ${tema.tekstFamilie};
    font-size: ${tema.storrelser.tekst.generell};
    padding: 10px;
    background: ${tema.farger.snakkebobler.bot};
    border-radius: ${(props: SnakkebobleState) =>
        props.side === 'VENSTRE' ? '0 5px 5px 5px' : '5px 0 5px 5px'};
`;

export default class Snakkeboble extends Component<
    SnakkebobleProps,
    SnakkebobleState
> {
    constructor(props: SnakkebobleProps) {
        super(props);
        this.state = {
            side: 'VENSTRE'
        };
    }

    render() {
        const { nickName, sent, content } = this.props.Message;
        return (
            <Konteiner>
                <MetaInfo
                    nickName={nickName}
                    sent={sent}
                    side={this.state.side}
                />
                <Test>
                    <Test2
                        dangerouslySetInnerHTML={{ __html: unescape(content) }}
                        side={this.state.side}
                    />
                </Test>
            </Konteiner>
        );
    }
}
