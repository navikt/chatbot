import React from 'react';
import minimerIkon from '../../assets/minimer.svg';
import omstartIkon from '../../assets/omstart.svg';
import avsluttIkon from '../../assets/avslutt.svg';
import {Bar, Knapp, Knapper, Navn} from './styles';

export type ToppBarProps = {
    lukk: () => void;
    avslutt: () => void;
    omstart: () => void;
    navn: string | undefined;
};

export default function ToppBar(props: ToppBarProps) {
    const navn = props.navn ?? 'Chatbot Frida';
    const {lukk, omstart, avslutt} = props;

    return (
        <Bar navn={navn}>
            <Navn>{navn}</Navn>

            <Knapper>
                <Knapp
                    navn={navn}
                    onClick={lukk}
                    dangerouslySetInnerHTML={{__html: minimerIkon}}
                    tabIndex={0}
                    aria-label={`Minimer ${navn}`}
                />

                <Knapp
                    navn={navn}
                    onClick={omstart}
                    dangerouslySetInnerHTML={{__html: omstartIkon}}
                    tabIndex={0}
                    aria-label={`Start ${navn} på nytt.`}
                />

                <Knapp
                    navn={navn}
                    onClick={() => avslutt()}
                    dangerouslySetInnerHTML={{__html: avsluttIkon}}
                    tabIndex={0}
                    aria-label={`Avslutt ${navn}`}
                />
            </Knapper>
        </Bar>
    );
}
