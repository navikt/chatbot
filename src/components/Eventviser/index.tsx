import React, {useMemo} from 'react';
import {userTypeConstants, eventTypeConstants} from '../../constants';
import {MessageWithIndicator} from '../ChatContainer';
import Skriveindikator from '../Skriveindikator';
import {Event} from './styles';

export type Properties = {
    beskjed: MessageWithIndicator;
    hentBrukerType: (brukerId: number) => string | undefined;
};

const Eventviser = (properties: Properties) => {
    const event = useMemo<React.ReactNode>(() => {
        const {content, nickName, userId, showIndicator} = properties.beskjed;

        if (content === eventTypeConstants.remoteDisconnected) {
            return `${nickName} forlot chatten.`;
        }

        if (content === eventTypeConstants.remoteConnected) {
            return `${nickName} ble med i chatten.`;
        }

        if (content === eventTypeConstants.userDisconnected) {
            return 'Du avsluttet chatten.';
        }

        if (
            content === eventTypeConstants.remoteIsTyping &&
            properties.hentBrukerType(userId) === userTypeConstants.human
        ) {
            return <Skriveindikator visIndikator={showIndicator} />;
        }

        return '';
    }, [properties.beskjed]);

    return <Event tabIndex={0}>{event}</Event>;
};

export default Eventviser;
