import React, {Component} from 'react';
import {KommunikasjonProps} from '../Kommunikasjon';
import {Event} from './styles';
import Skriveindikator from '../Skriveindikator';

export default class Eventviser extends Component<KommunikasjonProps> {
    constructor(props: KommunikasjonProps) {
        super(props);
        this.visEventTekst = this.visEventTekst.bind(this);
    }

    render() {
        return <Event tabIndex={0}>{this.visEventTekst()}</Event>;
    }

    private visEventTekst() {
        const {nickName, userId} = this.props.beskjed;
        if (this.props.beskjed.content === 'USER_DISCONNECTED') {
            return `${nickName} forlot chatten.`;
        }

        if (this.props.beskjed.content === 'USER_CONNECTED') {
            return `${nickName} ble med i chatten.`;
        }

        if (this.props.beskjed.content === 'REQUEST_DISCONNECTED') {
            return 'Du avsluttet chatten.';
        }

        if (
            this.props.beskjed.content === 'TYPE_MSG' &&
            this.props.hentBrukerType(userId) === 'Human'
        ) {
            return (
                <Skriveindikator
                    visIndikator={this.props.beskjed.showIndicator}
                />
            );
        }

        return '';
    }
}
