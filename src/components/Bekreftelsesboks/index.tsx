import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Boks, JaKnapp, NeiKnapp, Tekst, Undertekst } from './styles';
import avsluttIkon from '../../assets/avslutt.svg';
import checkIkon from '../../assets/check.svg';
import { Ikon } from '../Alertstripe/styles';

type BekreftelsesboksProps = {
    tekst?: string;
    undertekst?: string | null;
    ja?: () => void;
    nei?: () => void;
};

export default class Bekreftelsesboks extends Component<
    BekreftelsesboksProps,
    {}
> {
    componentDidMount() {
        const node = ReactDOM.findDOMNode(this) as HTMLElement;
        node.focus();
    }

    render() {
        return (
            <Boks type='advarsel' tabIndex={0}>
                <Ikon type='advarsel' tabIndex={-1} aria-hidden={true} />
                <Tekst>
                    {this.props.tekst}
                    {this.props.undertekst && (
                        <Undertekst>{this.props.undertekst}</Undertekst>
                    )}
                </Tekst>
                {this.props.ja && (
                    <JaKnapp
                        dangerouslySetInnerHTML={{ __html: checkIkon }}
                        onClick={() => this.props.ja!()}
                        aria-label={'Ja'}
                    />
                )}
                {this.props.nei && (
                    <NeiKnapp
                        dangerouslySetInnerHTML={{ __html: avsluttIkon }}
                        onClick={() => this.props.nei!()}
                        aria-label={'Nei'}
                    />
                )}
            </Boks>
        );
    }
}
