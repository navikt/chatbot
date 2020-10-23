import React from 'react';
import minimizeIcon from '../../assets/minimize.svg';
import restartIcon from '../../assets/restart.svg';
import cancelIcon from '../../assets/cancel.svg';
import {Bar, Knapp, Knapper, Navn} from './styles';

export type ToppBarProperties = {
    lukk: () => void;
    avslutt: () => void;
    omstart: () => void;
    navn: string | undefined;
};

const ToppBar = (properties: ToppBarProperties) => {
    const navn = properties.navn ?? 'Chatbot Frida';
    const {lukk, omstart, avslutt} = properties;

    return (
        <Bar navn={navn}>
            <Navn>{navn}</Navn>

            <Knapper>
                <Knapp
                    navn={navn}
                    dangerouslySetInnerHTML={{__html: minimizeIcon}}
                    tabIndex={0}
                    aria-label={`Minimer ${navn}`}
                    onClick={lukk}
                />

                <Knapp
                    navn={navn}
                    dangerouslySetInnerHTML={{__html: restartIcon}}
                    tabIndex={0}
                    aria-label={`Start ${navn} på nytt.`}
                    onClick={omstart}
                />

                <Knapp
                    navn={navn}
                    dangerouslySetInnerHTML={{__html: cancelIcon}}
                    tabIndex={0}
                    aria-label={`Avslutt ${navn}`}
                    onClick={() => avslutt()}
                />
            </Knapper>
        </Bar>
    );
};

export default ToppBar;
