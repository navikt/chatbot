import React from 'react';
import {Container, NickName} from './styles';
import moment from 'moment';

export type MetaInfoProps = {
    nickName?: string;
    sent?: string;
    side?: 'VENSTRE' | 'HOYRE';
    skraTekst?: boolean;
};

export default function MetaInfo(props: MetaInfoProps) {
    const {nickName, sent, side} = props;

    return (
        <Container side={side}>
            {nickName !== 'Bruker' && (
                <NickName aria-hidden='true' side={side}>
                    {nickName}
                </NickName>
            )}

            {moment(sent).format('HH:mm')}
        </Container>
    );
}
