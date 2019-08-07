import React, { Component } from 'react';
import styled from 'styled-components';
import tema from '../tema/tema';

import minimer from '../assets/minimer.svg';
import omstart from '../assets/omstart.svg';
import avslutt from '../assets/avslutt.svg';

const Bar = styled.div`
    border-bottom: 2px solid #000;
    font-family: Arial, sans-serif;
    font-size: ${tema.storrelser.tekst.toppBar};
    margin: 0;
    display: flex;
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
    }
`;

type ToppBarProps = {
    lukk: () => void;
};

export default class ToppBar extends Component<ToppBarProps, {}> {
    constructor(props: ToppBarProps) {
        super(props);
    }

    render() {
        return (
            <Bar>
                <Navn>Chatbot Frida</Navn>
                <Knapper>
                    <Knapp
                        onClick={this.props.lukk}
                        dangerouslySetInnerHTML={{ __html: minimer }}
                    />
                    <Knapp dangerouslySetInnerHTML={{ __html: omstart }} />
                    <Knapp dangerouslySetInnerHTML={{ __html: avslutt }} />
                </Knapper>
            </Bar>
        );
    }
}
