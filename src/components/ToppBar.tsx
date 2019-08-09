import React, { Component } from 'react';
import styled from 'styled-components';
import tema from '../tema/tema';

import minimer from '../assets/minimer.svg';
import omstart from '../assets/omstart.svg';
import avslutt from '../assets/avslutt.svg';

const Bar = styled.div`
    border-bottom: 2px solid #000;
    font-family: ${tema.tekstFamilie};
    font-size: ${tema.storrelser.tekst.toppBar};
    margin: 0;
    display: flex;
    background: ${(props: ToppBarProps) =>
        props.navn === 'Net Nordic'
            ? tema.farger.toppBar.bot
            : tema.farger.toppBar.ekstern};
    color: ${(props: ToppBarProps) =>
        props.navn === 'Net Nordic' ? undefined : '#fff'};
    transition: all 300ms ease-in-out;
`;

const Navn = styled.div`
    flex: 0 1 auto;
    padding: 15px;
`;

const Knapper = styled.div`
    flex: 0 1 auto;
    display: flex;
    margin-left: auto;
`;

const Knapp = styled.div`
    flex: 0 1 auto;
    padding: 15px;
    cursor: pointer;

    svg {
        width: 20px;
        height: 20px;

        line,
        path {
            stroke: ${(props: ToppBarProps) =>
                props.navn === 'Net Nordic' ? undefined : '#fff'};
            transition: all 300ms ease-in-out;
        }
    }
`;

type ToppBarProps = {
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
