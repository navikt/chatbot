import React, { Component } from 'react';
import { KommunikasjonProps } from '../Kommunikasjon';
import { Event } from './styles';
import Skriveindikator from '../Skriveindikator';

export default class Eventviser extends Component<KommunikasjonProps, {}> {
    constructor(props: KommunikasjonProps) {
        super(props);

        this.visEventTekst = this.visEventTekst.bind(this);
        this.hentAriaTekst = this.hentAriaTekst.bind(this);
    }

    render() {
        return (
            <Event aria-label={this.hentAriaTekst()}>
                {this.visEventTekst()}
            </Event>
        );
    }

    private visEventTekst() {
        switch (this.props.Beskjed.content) {
            case 'USER_DISCONNECTED':
                return `${this.props.Beskjed.nickName} forlot chatten.`;
            case 'USER_CONNECTED':
                return `${this.props.Beskjed.nickName} ble med i chatten.`;
            case 'TYPE_MSG':
                return <Skriveindikator beskjed={this.props.Beskjed} />;
            default:
                return;
        }
    }

    private hentAriaTekst(): string {
        switch (this.props.Beskjed.content) {
            case 'USER_DISCONNECTED':
                return `${this.props.Beskjed.nickName} forlot chatten.`;
            case 'USER_CONNECTED':
                return `${this.props.Beskjed.nickName} ble med i chatten.`;
            case 'TYPE_MSG':
                return `${this.props.Beskjed.nickName} skriver...`;
            default:
                return '';
        }
    }
}
