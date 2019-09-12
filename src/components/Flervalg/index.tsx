import React, { Component } from 'react';
import MetaInfo from '../MetaInfo';
import { Container, Valg, ValgContainer } from './styles';
import { Message } from '../../api/Sessions';

type FlervalgProps = {
    beskjed: Message;
    harBlittBesvart: boolean;
    velg: (messageId: number, valg: string) => void;
};

export interface ValgProps {
    valgt: boolean;
    aktiv: boolean;
}

export default class Flervalg extends Component<FlervalgProps, {}> {
    render() {
        const options = this.props.beskjed.content.map(
            (_h: { tekst: string; valgt: boolean }, index: number) => (
                <Valg
                    key={index}
                    onClick={() => {
                        if (!this.props.harBlittBesvart) {
                            this.props.velg(this.props.beskjed.id, _h.tekst);
                        }
                    }}
                    valgt={_h.valgt}
                    aktiv={this.props.harBlittBesvart}
                    tabIndex={0}
                    aria-label={`Valg ${index + 1}: ${_h.tekst}`}
                >
                    {_h.tekst}
                </Valg>
            )
        );
        return (
            <Container>
                <MetaInfo
                    nickName={this.props.beskjed.nickName}
                    sent={this.props.beskjed.sent}
                    side='VENSTRE'
                />
                <ValgContainer
                    aria-label={`${this.props.beskjed.nickName} har sendt deg ${
                        options.length
                    } valgmuligheter.`}
                >
                    {options}
                </ValgContainer>
            </Container>
        );
    }
}
