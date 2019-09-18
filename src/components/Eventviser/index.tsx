import React, { Component } from 'react';
import { KommunikasjonProps } from '../Kommunikasjon';
import { Event } from './styles';

export default class Eventviser extends Component<KommunikasjonProps, {}> {
    constructor(props: KommunikasjonProps) {
        super(props);

        this.visEventTekst = this.visEventTekst.bind(this);
        this.hentAriaTekst = this.hentAriaTekst.bind(this);
    }

    render() {
        return (
            <Event aria-label={this.hentAriaTekst()} tabIndex={0}>
                {this.visEventTekst()}
            </Event>
        );
    }

    private visEventTekst() {
        const { nickName } = this.props.beskjed;
        switch (this.props.beskjed.content) {
            case 'USER_DISCONNECTED':
                return `${nickName} forlot chatten.`;
            case 'USER_CONNECTED':
                return `${nickName} ble med i chatten.`;
            case 'REQUEST_DISCONNECTED':
                return 'Bruker forlot chatten.';

            default:
                return;
        }
    }

    private hentAriaTekst(): string {
        const { nickName } = this.props.beskjed;
        switch (this.props.beskjed.content) {
            case 'USER_DISCONNECTED':
                return `${nickName} forlot chatten.`;
            case 'USER_CONNECTED':
                return `${nickName} ble med i chatten.`;
            case 'TYPE_MSG':
                return `${nickName} skriver...`;
            default:
                return '';
        }
    }
}
