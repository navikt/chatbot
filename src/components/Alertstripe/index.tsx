import React, { Component } from 'react';
import { Container, Ikon, Tekst } from './styles';

export type AlertstripeProps = {
    type: 'INFORMASJON' | 'ADVARSEL';
    tekst: string;
};

export default class Alertstripe extends Component<AlertstripeProps, {}> {
    render() {
        return (
            <Container type={this.props.type} tekst={this.props.tekst}>
                <Ikon type={this.props.type} tekst={this.props.tekst} />
                <Tekst>{this.props.tekst}</Tekst>
            </Container>
        );
    }
}
