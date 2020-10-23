import React from 'react';
import cancelIcon from '../../assets/cancel.svg';
import checkIcon from '../../assets/check.svg';
import {Boks, Innhold, JaKnapp, NeiKnapp, Tekst, Undertekst} from './styles';

type Properties = {
    tekst?: string;
    undertekst?: string | null;
    ja?: () => void;
    nei?: () => void;
};

const Bekreftelsesboks = (properties: Properties) => {
    return (
        <Boks type='advarsel'>
            <Innhold>
                <Tekst>
                    {properties.tekst}

                    {properties.undertekst && (
                        <Undertekst>{properties.undertekst}</Undertekst>
                    )}
                </Tekst>

                {properties.ja && (
                    <JaKnapp
                        dangerouslySetInnerHTML={{__html: checkIcon}}
                        aria-label='Ja'
                        onClick={() => properties.ja!()}
                    />
                )}

                {properties.nei && (
                    <NeiKnapp
                        dangerouslySetInnerHTML={{
                            __html: cancelIcon
                        }}
                        aria-label='Nei'
                        onClick={() => properties.nei!()}
                    />
                )}
            </Innhold>
        </Boks>
    );
};

export default Bekreftelsesboks;
