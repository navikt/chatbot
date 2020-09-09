import {
    Checkbox,
    CheckboxGruppe,
    Radio,
    RadioGruppe,
    SkjemaGruppe,
} from 'nav-frontend-skjema';
import React, { useState } from 'react';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { Container, Header, SurveyForm } from './styles';
import { AnalyticsCallback } from '../../index';
import { getEvalState, setEvalState } from '../../utils/evalStateUtils';

export type SurveyQuestion = {
    label: string;
    options: string[];
    type: 'radio' | 'checkbox';
};

export type SurveyAnswer = {
    [key: string]: string[];
};

type Props = {
    analyticsCallback?: AnalyticsCallback;
    analyticsSurvey: SurveyQuestion[];
};

const toggleArrayValue = (arr: string[], value: string) =>
    arr.includes(value)
        ? arr.filter((v: any) => v !== value)
        : arr.concat(value);

export const Evaluering = ({ analyticsCallback, analyticsSurvey }: Props) => {
    const [surveyInput, setSurveyInput] = useState<SurveyAnswer>({});
    const [surveySent, setSurveySent] = useState(getEvalState().sent);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const evalState = getEvalState();
        setEvalState({ ...evalState, sent: true });
        setSurveySent(true);

        if (analyticsCallback) {
            analyticsCallback('tilbakemelding', {
                komponent: 'frida',
                veileder: !!evalState.veileder,
                english: evalState.english,
                rollevalg: evalState.rollevalg,
                temavalg: evalState.temavalg,
            });
            Object.entries(surveyInput).forEach(([question, answer]) =>
                analyticsCallback('tilbakemelding', {
                    komponent: 'frida',
                    spørsmål: question,
                    svar: answer,
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
