import React, { Component } from 'react';

import minimerIkon from '../../assets/minimer.svg';
import omstartIkon from '../../assets/omstart.svg';
import avsluttIkon from '../../assets/avslutt.svg';
import { Bar, Knapp, Knapper, Navn } from './styles';

export type ToppBarProps = {
    lukk?: () => void;
    avslutt?: () => void;
    navn: string | undefined;
};

export default class ToppBar extends Component<ToppBarProps, {}> {
    constructor(props: ToppBarProps) {
        super(props);
    }

    render() {
        const { lukk, avslutt, navn } = this.props;
        return (
            <Bar navn={this.props.navn}>
                <Navn>{navn}</Navn>
                <Knapper>
                    <Knapp
                        navn={this.props.navn}
                        onClick={lukk}
                        dangerouslySetInnerHTML={{ __html: minimerIkon }}
                    />
                    <Knapp
                        navn={this.props.navn}
                        dangerouslySetInnerHTML={{ __html: omstartIkon }}
                    />
                    <Knapp
                        navn={this.props.navn}
                        onClick={avslutt}
                        dangerouslySetInnerHTML={{ __html: avsluttIkon }}
                    />
                </Knapper>
            </Bar>
        );
    }
}
