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
    required?: boolean;
};

type SurveyAnswers = {
    [key: string]: string[];
};

type Props = {
    analyticsCallback?: AnalyticsCallback;
    analyticsSurvey: SurveyQuestion[];
};

const findInvalidInput = (
    questions: SurveyQuestion[],
    answers: SurveyAnswers
): string[] =>
    questions.reduce((missing, question) => {
        const answer = answers[question.label];
        return question.required && (!answer || answer.length === 0)
            ? missing.concat(question.label)
            : missing;
    }, [] as string[]);

const toggleArrayValue = (arr: string[], value: string) =>
    arr.includes(value)
        ? arr.filter((v: any) => v !== value)
        : arr.concat(value);

export const Evaluering = ({ analyticsCallback, analyticsSurvey }: Props) => {
    const [surveyInput, setSurveyInput] = useState<SurveyAnswers>({});
    const [invalidInput, setInvalidInput] = useState<string[]>([]);
    const [surveySent, setSurveySent] = useState(getEvalState().sent);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const _invalidInput = findInvalidInput(analyticsSurvey, surveyInput);
        if (_invalidInput.length > 0) {
            setInvalidInput(_invalidInput);
            return;
        }

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
            <SkjemaGruppe
                feil={
                    invalidInput.length > 0
                        ? 'Obligatoriske felt mangler'
                        : undefined
                }
            >
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
                        {analyticsSurvey.map((question, index) => {
                            if (question.type === 'radio') {
                                return (
                                    <RadioGruppe
                                        legend={question.label}
                                        feil={
                                            invalidInput.includes(
                                                question.label
                                            )
                                                ? '* obligatorisk'
                                                : undefined
                                        }
                                        key={index}
                                    >
                                        {question.options.map((option) => (
                                            <Radio
                                                label={option}
                                                name={question.label}
                                                onClick={() => {
                                                    setInvalidInput(
                                                        invalidInput.filter(
                                                            (value) =>
                                                                value !==
                                                                question.label
                                                        )
                                                    );
                                                    setSurveyInput((state) => ({
                                                        ...state,
                                                        [question.label]: [
                                                            option,
                                                        ],
                                                    }));
                                                }}
                                                key={option}
                                            />
                                        ))}
                                    </RadioGruppe>
                                );
                            } else if (question.type === 'checkbox') {
                                return (
                                    <CheckboxGruppe
                                        legend={question.label}
                                        feil={
                                            invalidInput.includes(
                                                question.label
                                            )
                                                ? '* obligatorisk'
                                                : undefined
                                        }
                                        key={index}
                                    >
                                        {question.options.map((option) => (
                                            <Checkbox
                                                label={option}
                                                name={question.label}
                                                onClick={() => {
                                                    setInvalidInput(
                                                        invalidInput.filter(
                                                            (value) =>
                                                                value !==
                                                                question.label
                                                        )
                                                    );
                                                    setSurveyInput((state) => ({
                                                        ...state,
                                                        [question.label]: toggleArrayValue(
                                                            state[
                                                                question.label
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
                        <Hovedknapp
                            htmlType={'submit'}
                            kompakt={true}
                            disabled={invalidInput.length > 0}
                        >
                            {'Send tilbakemelding'}
                        </Hovedknapp>
                    </SurveyForm>
                )}
            </SkjemaGruppe>
        </Container>
    );
};

export default Evaluering;
