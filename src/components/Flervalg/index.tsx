import React, { Component } from 'react';
import MetaInfo from '../MetaInfo';
import { Container, Valg, ValgContainer } from './styles';
import { Message } from '../../api/Sessions';

type FlervalgProps = {
    beskjed: Message;
    harBlittBesvart: boolean;
    velg: (messageId: number, valg: string) => void;
    sisteBrukerId: number | null;
};

type FlervalgState = {
    kollaps: boolean;
};

export interface ValgProps {
    valgt?: boolean;
    aktiv?: boolean;
    kollaps?: boolean;
}

export default class Flervalg extends Component<FlervalgProps, FlervalgState> {
    constructor(props: FlervalgProps) {
        super(props);
        this.state = {
            kollaps:
                (this.props.sisteBrukerId &&
                    this.props.sisteBrukerId === this.props.beskjed.userId) ||
                false
        };
    }

    render() {
        const options = this.props.beskjed.content.map(
            (_h: { tekst: string; valgt: boolean }, index: number) => (
                <Valg
                    key={index}
                    valgt={_h.valgt}
                    aktiv={this.props.harBlittBesvart}
                    tabIndex={-1}
                    aria-label={`Valg ${index + 1}: ${_h.tekst}. ${
                        _h.valgt ? 'Du har valgt dette valget.' : ''
                    }`}
                >
                    <button
                        onClick={() => {
                            if (!this.props.harBlittBesvart) {
                                this.props.velg(
                                    this.props.beskjed.id,
                                    _h.tekst
                                );
                            }
                        }}
                        tabIndex={0}
                    >
                        {_h.tekst}
                    </button>
                </Valg>
            )
        );
        return (
            <Container kollaps={this.state.kollaps}>
                {!this.state.kollaps && (
                    <MetaInfo
                        nickName={this.props.beskjed.nickName}
                        sent={this.props.beskjed.sent}
                        side='VENSTRE'
                    />
                )}
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
