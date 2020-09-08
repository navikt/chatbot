import React from 'react';
import {
    Boks,
    InnerContainer,
    JaKnapp,
    NeiKnapp,
    Tekst,
    Undertekst,
} from './styles';
import avsluttIkon from '../../assets/avslutt.svg';
import checkIkon from '../../assets/check.svg';

type Props = {
    tekst?: string;
    undertekst?: string | null;
    ja?: () => void;
    nei?: () => void;
};

export const Bekreftelsesboks = (props: Props) => {
    return (
        <Boks type={'advarsel'}>
            <InnerContainer>
                <Tekst>
                    {props.tekst}
                    {props.undertekst && (
                        <Undertekst>{props.undertekst}</Undertekst>
                    )}
                </Tekst>
                {props.ja && (
                    <JaKnapp
                        dangerouslySetInnerHTML={{ __html: checkIkon }}
                        onClick={() => props.ja!()}
                        aria-label={'Ja'}
                    />
                )}
                {props.nei && (
                    <NeiKnapp
                        dangerouslySetInnerHTML={{
                            __html: avsluttIkon,
                        }}
                        onClick={() => props.nei!()}
                        aria-label={'Nei'}
                    />
                )}
            </InnerContainer>
        </Boks>
    );
};

export default Bekreftelsesboks;
