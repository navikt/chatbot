import React, { Component } from 'react';
import styled from 'styled-components';
import { render } from 'react-dom';

import Chat from '../../src';

const Outer = styled.div`
    padding: 0;
    margin: 0;
`;

class Demo extends Component {
    render() {
        return (
            <Outer>
                <Chat
                    customerKey='41155'
                    queueKey='Q_CHAT_BOT'
                    configId='599f9e7c-7f6b-4569-81a1-27202c419953'
                    label={'Chat med NAV'}
                    analyticsSurvey={[
                        {
                            label: 'Fikk du svar på det du lurte på?',
                            options: ['Ja', 'Nei', 'Delvis'],
                            type: 'radio',
                            required: true,
                        },
                        {
                            label: 'Hva kom du hit for å gjøre?',
                            options: [
                                'Levere sykemelding',
                                'Sjekke eller oppdatere aktivitetsplanen',
                                'Sjekke status eller følge opp sykemelding',
                                'Sjekke status på søknaden eller saken min',
                                'Sjekke status på utbetalinger',
                                'Sende meldekort',
                                'Sende skjema eller søknad',
                                'Sende melding eller svar til NAV',
                                'Lese meldinger fra NAV',
                                'Finne informasjon og forstå mine rettigheter',
                                'Finne ledige stillinger eller søke jobb',
                                'Finne statistikk, analyse eller forskning',
                                'Sjekke eller oppdatere oppfølgingsplanen',
                                'Annet',
                            ],
                            type: 'checkbox',
                            required: true,
                        },
                        {
                            label: 'Er du fornøyd med hjelpen du fikk?',
                            options: [
                                'Jeg er veldig fornøyd',
                                'Jeg er fornøyd',
                                'Jeg er misfornøyd',
                                'Jeg er veldig misfornøyd',
                            ],
                            type: 'radio',
                            required: true,
                        },
                    ]}
                />
            </Outer>
        );
    }
}

render(<Demo />, document.querySelector('#demo'));
