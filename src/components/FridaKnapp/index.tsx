import React from 'react';
import {FridaKnapp, FridaIkon, FridaTekst} from './styles';

type Properties = {
    onClick: () => void;
    navn: string;
    queueKey: string;
    label?: string;
};

export const FridaKnappContainer = (properties: Properties) => {
    return (
        <FridaKnapp
            id='chatbot-frida-knapp'
            aria-label={`Samtalevindu: ${properties.navn}`}
            lang='no'
            onClick={properties.onClick}
        >
            <FridaTekst>{properties.label ?? 'Chatbot Frida'}</FridaTekst>
            <FridaIkon queueKey={properties.queueKey} />
        </FridaKnapp>
    );
};
