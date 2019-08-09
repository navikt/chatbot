import React, { Component } from 'react';
import { Beskjed, KommunikasjonProps } from './Kommunikasjon';
import styled from 'styled-components';
import tema from '../tema/tema';

const Event = styled.div`
    font-family: ${tema.tekstFamilie};
    font-size: ${tema.storrelser.tekst.metaInfo};
    color: ${tema.farger.tekstfelt};
    margin: 10px 0;
    font-style: italic;
`;

export default class Eventviser extends Component<KommunikasjonProps, {}> {
    constructor(props: KommunikasjonProps) {
        super(props);

        Eventviser.visEventTekst = Eventviser.visEventTekst.bind(this);
    }

    render() {
        return <Event>{Eventviser.visEventTekst(this.props.Beskjed)}</Event>;
    }

    private static visEventTekst(event: Beskjed) {
        switch (event.content) {
            case 'USER_DISCONNECTED':
                return `${event.nickName} forlot chatten.`;
            case 'USER_CONNECTED':
                return `${event.nickName} ble med i chatten.`;
            default:
                return;
        }
    }
}
