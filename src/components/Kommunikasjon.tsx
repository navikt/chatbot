import React, { Component } from 'react';
import styled from 'styled-components';
import MetaInfo from './MetaInfo';
import tema from '../tema/tema';
import fridaIkon from '../assets/frida.svg';

export type Beskjed = {
    arguments: any[] | null;
    content: string;
    id: number;
    nickName: string;
    role: 0 | 1;
    sent: string;
    type:
        | 'Message'
        | 'Event'
        | 'Intro'
        | 'Option'
        | 'OptionResult'
        | 'Command'
        | 'Reaction'
        | 'UserInfo'
        | 'Template';
    userId: number;
};

export type KommunikasjonProps = {
    Beskjed: Beskjed;
    visBilde: boolean;
};

type KommunikasjonState = {
    side: 'VENSTRE' | 'HOYRE';
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    margin: 10px 0;
`;

const Indre = styled.div`
    display: flex;
`;

const Venstre = styled.div`
    width: 50px;
    flex: 0 0 50px;
    margin-right: 10px;
`;

const Hoyre = styled.div`
    margin-left: ${(props: KommunikasjonState) =>
        props.side === 'VENSTRE' ? undefined : 'auto'};
    max-width: ${(props: KommunikasjonState) =>
        props.side === 'VENSTRE' ? undefined : '80%'};
`;

const Brukerbilde = styled.div`
    width: 50px;
    height: 50px;
    background: transparent url('data:image/svg+xml;base64, ${window.btoa(
        fridaIkon
    )}') no-repeat center center;
`;

const Snakkeboble = styled.div`
    font-family: ${tema.tekstFamilie};
    font-size: ${tema.storrelser.tekst.generell};
    padding: 10px;
    background: ${(props: KommunikasjonState) =>
        props.side === 'VENSTRE'
            ? tema.farger.snakkebobler.bot
            : tema.farger.snakkebobler.bruker};
    border-radius: ${(props: KommunikasjonState) =>
        props.side === 'VENSTRE' ? '0 5px 5px 5px' : '5px 0 5px 5px'};
`;

export default class Kommunikasjon extends Component<
    KommunikasjonProps,
    KommunikasjonState
> {
    constructor(props: KommunikasjonProps) {
        super(props);
        this.state = {
            side: 'VENSTRE'
        };
    }

    componentDidMount() {
        this.setState({
            side: this.props.Beskjed.role === 1 ? 'VENSTRE' : 'HOYRE'
        });
    }

    render() {
        const { nickName, sent, content } = this.props.Beskjed;
        return (
            <Container>
                <MetaInfo
                    nickName={nickName}
                    sent={sent}
                    side={this.state.side}
                />
                <Indre>
                    {this.props.visBilde && this.state.side === 'VENSTRE' && (
                        <Venstre>
                            <Brukerbilde />
                        </Venstre>
                    )}
                    <Hoyre side={this.state.side}>
                        <Snakkeboble
                            dangerouslySetInnerHTML={{
                                __html: unescape(content)
                            }}
                            side={this.state.side}
                        />
                    </Hoyre>
                </Indre>
            </Container>
        );
    }
}
