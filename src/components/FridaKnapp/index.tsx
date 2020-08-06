import React from 'react';
import { FridaKnapp, FridaIkon, FridaTekst } from './styles';

type Props = {
    onClick: () => void;
    navn: string;
    queueKey: string;
};

export const FridaKnappContainer = (props: Props) => {
    return (
        <FridaKnapp
            onClick={props.onClick}
            aria-label={`Samtalevindu: ${props.navn}`}
            lang={'no'}
            id={'chatbot-frida-knapp'}
        >
            <FridaTekst>{'Chatbot Frida'}</FridaTekst>
            <FridaIkon queueKey={props.queueKey} />
        </FridaKnapp>
    );
};
