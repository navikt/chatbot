import React, { Component } from 'react';

import minimerIkon from '../../assets/minimer.svg';
import omstartIkon from '../../assets/omstart.svg';
import avsluttIkon from '../../assets/avslutt.svg';
import { Bar, Knapp, Knapper, Navn } from './styles';

export type ToppBarProps = {
    lukk?: () => void;
    avslutt?: () => void;
    omstart?: () => void;
    navn: string | undefined;
};

export default class ToppBar extends Component<ToppBarProps, {}> {
    constructor(props: ToppBarProps) {
        super(props);
    }

    render() {
        const { lukk, omstart, avslutt, navn } = this.props;
        return (
            <Bar navn={this.props.navn}>
                <Navn>{navn}</Navn>
                <Knapper>
                    <Knapp
                        navn={this.props.navn}
                        onClick={lukk}
                        dangerouslySetInnerHTML={{ __html: minimerIkon }}
                        tabIndex={0}
                    />
                    <Knapp
                        navn={this.props.navn}
                        onClick={omstart}
                        dangerouslySetInnerHTML={{ __html: omstartIkon }}
                        tabIndex={0}
                    />
                    <Knapp
                        navn={this.props.navn}
                        onClick={avslutt}
                        dangerouslySetInnerHTML={{ __html: avsluttIkon }}
                        tabIndex={0}
                    />
                </Knapper>
            </Bar>
        );
    }
}
