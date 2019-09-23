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
            <Event aria-label={this.hentAriaTekst()} tabIndex={0}>
                {this.visEventTekst()}
            </Event>
        );
    }

    private visEventTekst() {
        const { nickName, userId } = this.props.beskjed;
        if (this.props.beskjed.content === 'USER_DISCONNECTED') {
            return `${nickName} forlot chatten.`;
        } else if (this.props.beskjed.content === 'USER_CONNECTED') {
            return `${nickName} ble med i chatten.`;
        } else if (this.props.beskjed.content === 'REQUEST_DISCONNECTED') {
            return 'Bruker forlot chatten.';
        } else if (
            this.props.beskjed.content === 'TYPE_MSG' &&
            this.props.hentBrukerType(userId) === 'Human'
        ) {
            return (
                <Skriveindikator
                    beskjed={this.props.beskjed}
                    skriveindikatorTid={this.props.skriveindikatorTid!}
                    gjemAutomatisk={true}
                />
            );
        } else {
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
