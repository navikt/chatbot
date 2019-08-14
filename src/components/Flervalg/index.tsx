import React, { Component } from 'react';
import { Beskjed } from '../Kommunikasjon';
import MetaInfo from '../MetaInfo';
import { Valg, ValgContainer } from './styles';

type FlervalgProps = {
    beskjed: Beskjed;
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
                >
                    {_h.tekst}
                </Valg>
            )
        );
        return (
            <div>
                <MetaInfo
                    nickName={this.props.beskjed.nickName}
                    sent={this.props.beskjed.sent}
                    side='VENSTRE'
                />
                <ValgContainer>{options}</ValgContainer>
            </div>
        );
    }
}