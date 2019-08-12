import React, { Component } from 'react';

import minimer from '../../assets/minimer.svg';
import omstart from '../../assets/omstart.svg';
import avslutt from '../../assets/avslutt.svg';
import { Bar, Knapp, Knapper, Navn } from './styles';

export type ToppBarProps = {
    lukk?: () => void;
    navn: string | undefined;
};

export default class ToppBar extends Component<ToppBarProps, {}> {
    constructor(props: ToppBarProps) {
        super(props);
    }

    render() {
        const { lukk, navn } = this.props;
        return (
            <Bar navn={this.props.navn}>
                <Navn>{navn}</Navn>
                <Knapper>
                    <Knapp
                        navn={this.props.navn}
                        onClick={lukk}
                        dangerouslySetInnerHTML={{ __html: minimer }}
                    />
                    <Knapp
                        navn={this.props.navn}
                        dangerouslySetInnerHTML={{ __html: omstart }}
                    />
                    <Knapp
                        navn={this.props.navn}
                        dangerouslySetInnerHTML={{ __html: avslutt }}
                    />
                </Knapper>
            </Bar>
        );
    }
}
