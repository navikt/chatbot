import React, { Component } from 'react';
import { Beskjed, KommunikasjonProps } from '../Kommunikasjon';
import { Event } from './styles';
import Skriveindikator from '../Skriveindikator';

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
            // case 'USER_DISCONNECTED':
            //     return `${event.nickName} forlot chatten.`;
            // case 'USER_CONNECTED':
            //     return `${event.nickName} ble med i chatten.`;
            case 'TYPE_MSG':
                return <Skriveindikator message={event} />;
            default:
                return;
        }
    }
}
