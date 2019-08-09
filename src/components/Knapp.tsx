import React, { Component } from 'react';
import styled from 'styled-components';
import tema from '../tema/tema';

const KnappElement = styled.button`
    outline: none;
    background: #fff;
    border: 1px solid ${tema.farger.interaksjon};
    color: ${tema.farger.interaksjon};
    cursor: pointer;
    padding: 10px;
    font-family: ${tema.tekstFamilie};
    font-size: ${tema.storrelser.tekst.generell};
`;

export default class Knapp extends Component {
    render() {
        return <KnappElement type='submit'>{this.props.children}</KnappElement>;
    }
}
