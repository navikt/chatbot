import React from 'react';
import moment from 'moment';
import {Boks, Navn} from './styles';

export type Properties = {
    nickName?: string;
    sent?: string;
    side?: 'VENSTRE' | 'HOYRE';
    skraTekst?: boolean;
};

const MetaInfo = (properties: Properties) => {
    const {nickName, sent, side} = properties;

    return (
        <Boks side={side}>
            {nickName !== 'Bruker' && (
                <Navn aria-hidden='true' side={side}>
                    {nickName}
                </Navn>
            )}

            {moment(sent).format('HH:mm')}
        </Boks>
    );
};

export default MetaInfo;
