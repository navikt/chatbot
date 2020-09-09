import {
    Checkbox,
    CheckboxGruppe,
    Radio,
    RadioGruppe,
    SkjemaGruppe,
} from 'nav-frontend-skjema';
import React, { useState } from 'react';
import { Hovedknapp } from 'nav-frontend-knapper';
import { SurveyAnswer, SurveyQuestion, defaultSurvey } from './surveyFields';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { Container, Header, SurveyForm } from './styles';
import { AnalyticsCallback } from '../../index';
import { Bruker } from '../Interaksjonsvindu';

type Props = {
    brukere: Bruker[];
    analyticsCallback?: AnalyticsCallback;
    analyticsSurvey?: SurveyQuestion[];
};

const toggleArrayValue = (arr: string[], value: string) =>
    arr.includes(value)
        ? arr.filter((v: any) => v !== value)
        : arr.concat(value);

const hasHumanResponse = (brukere: Bruker[]) =>
    brukere.some((bruker) => bruker.userType === 'Human');

export const Evaluering = ({
    brukere,
    analyticsCallback,
    analyticsSurvey = defaultSurvey,
}: Props) => {
    const [surveyInput, setSurveyInput] = useState<SurveyAnswer>({});
    const [surveySent, setSurveySent] = useState(false);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSurveySent(true);

        if (analyticsCallback) {
            Object.entries(surveyInput).forEach(([question, answer]) =>
                analyticsCallback('tilbakemelding', {
                    komponent: 'chatbot',
                    spørsmål: question,
                    svar: answer,
                    veileder: hasHumanResponse(brukere),
                })
            );
        }
    };

    return (
        <Container>
            <SkjemaGruppe>
                <Header>
                    {surveySent ? (
                        <Normaltekst>
                            {'Takk for din tilbakemelding!'}
                        </Normaltekst>
                    ) : (
                        <>
                            <Undertittel>{'Tilbakemelding'}</Undertittel>
                            <Normaltekst>
                                {'Jeg ønsker å lære av opplevelsen din.'}
                            </Normaltekst>
                        </>
                    )}
                </Header>
                {!surveySent && (
                    <SurveyForm onSubmit={onSubmit}>
                        {analyticsSurvey.map((fieldSet, index) => {
                            if (fieldSet.type === 'radio') {
                                return (
                                    <RadioGruppe
                                        legend={fieldSet.label}
                                        key={index}
                                    >
                                        {fieldSet.options.map((option) => (
                                            <Radio
                                                label={option}
                                                name={fieldSet.label}
                                                onClick={() =>
                                                    setSurveyInput((state) => ({
                                                        ...state,
                                                        [fieldSet.label]: [
                                                            option,
                                                        ],
                                                    }))
                                                }
                                                key={option}
                                            />
                                        ))}
                                    </RadioGruppe>
                                );
                            } else if (fieldSet.type === 'checkbox') {
                                return (
                                    <CheckboxGruppe
                                        legend={fieldSet.label}
                                        key={index}
                                    >
                                        {fieldSet.options.map((option) => (
                                            <Checkbox
                                                label={option}
                                                name={fieldSet.label}
                                                onClick={() => {
                                                    setSurveyInput((state) => ({
                                                        ...state,
                                                        [fieldSet.label]: toggleArrayValue(
                                                            state[
                                                                fieldSet.label
                                                            ] || [],
                                                            option
                                                        ),
                                                    }));
                                                }}
                                                key={option}
                                            />
                                        ))}
                                    </CheckboxGruppe>
                                );
                            } else {
                                return null;
                            }
                        })}
                        <Hovedknapp htmlType={'submit'} kompakt={true}>
                            {'Send tilbakemelding'}
                        </Hovedknapp>
                    </SurveyForm>
                )}
            </SkjemaGruppe>
        </Container>
    );
};

export default Evaluering;
