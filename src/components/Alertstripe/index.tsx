import React, { Component } from 'react';
import { Container, Ikon, Tekst } from './styles';

export type AlertstripeProps = {
    type: 'info' | 'suksess' | 'advarsel' | 'feil';
};

export default class Alertstripe extends Component<AlertstripeProps, {}> {
    render() {
        return (
            <Container type={this.props.type} tabIndex={0}>
                <Ikon type={this.props.type} />
                <Tekst>{this.props.children}</Tekst>
            </Container>
        );
    }
}
