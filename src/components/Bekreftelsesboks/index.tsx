import React, { Component } from 'react';
import { Boks, Knapp, Tekst } from './styles';
import avsluttIkon from '../../assets/avslutt.svg';
import checkIkon from '../../assets/check.svg';

type BekreftelsesboksProps = {
    tekst?: string;
    ja?: () => void;
    nei?: () => void;
};

export default class Bekreftelsesboks extends Component<
    BekreftelsesboksProps,
    {}
> {
    render() {
        return (
            <Boks type={'advarsel'} tabIndex={0}>
                <Tekst>{this.props.tekst}</Tekst>
                {this.props.ja && (
                    <Knapp
                        dangerouslySetInnerHTML={{ __html: checkIkon }}
                        onClick={() => this.props.ja!()}
                        aria-label={'Ja'}
                    />
                )}
                {this.props.nei && (
                    <Knapp
                        dangerouslySetInnerHTML={{ __html: avsluttIkon }}
                        onClick={() => this.props.nei!()}
                        aria-label={'Nei'}
                    />
                )}
            </Boks>
        );
    }
}
