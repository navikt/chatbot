import React, { Component } from 'react';
import { Beskjed } from '../Kommunikasjon';
import MetaInfo from '../MetaInfo';
import { Valg, ValgContainer } from './styles';

type FlervalgProps = {
    beskjed: Beskjed;
    velg: (messageId: number, valg: string) => void;
};

export default class Flervalg extends Component<FlervalgProps, {}> {
    render() {
        console.log(this.props.beskjed.content);
        const options = this.props.beskjed.content.map(
            (_h: { tekst: string; valgt: boolean }, index: number) => (
                <Valg
                    key={index}
                    onClick={() =>
                        this.props.velg(this.props.beskjed.id, _h.tekst)
                    }
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
