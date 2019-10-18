import React, { Component } from 'react';

import minimerIkon from '../../assets/minimer.svg';
import omstartIkon from '../../assets/omstart.svg';
import avsluttIkon from '../../assets/avslutt.svg';
import { Bar, Knapp, Knapper, Navn } from './styles';

export type ToppBarProps = {
    lukk: () => void;
    avslutt: () => void;
    omstart: () => void;
    navn: string | undefined;
};

export default class ToppBar extends Component<ToppBarProps, {}> {
    constructor(props: ToppBarProps) {
        super(props);
    }

    render() {
        const { lukk, omstart, avslutt, navn } = this.props;
        return (
            <Bar navn={this.props.navn || 'Chatbot Frida'}>
                <Navn>{navn}</Navn>
                <Knapper>
                    <Knapp
                        navn={this.props.navn || 'Chatbot Frida'}
                        onClick={lukk}
                        dangerouslySetInnerHTML={{ __html: minimerIkon }}
                        tabIndex={0}
                        aria-label={`Minimer ${this.props.navn}`}
                    />
                    <Knapp
                        navn={this.props.navn || 'Chatbot Frida'}
                        onClick={omstart}
                        dangerouslySetInnerHTML={{ __html: omstartIkon }}
                        tabIndex={0}
                        aria-label={`Start ${this.props.navn} på nytt.`}
                    />
                    <Knapp
                        navn={this.props.navn || 'Chatbot Frida'}
                        onClick={() => avslutt()}
                        dangerouslySetInnerHTML={{ __html: avsluttIkon }}
                        tabIndex={0}
                        aria-label={`Avslutt ${this.props.navn}`}
                    />
                </Knapper>
            </Bar>
        );
    }
}
