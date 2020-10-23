import React, {useState} from 'react';
import {
    Checkbox,
    CheckboxGruppe,
    Radio,
    RadioGruppe,
    SkjemaGruppe
} from 'nav-frontend-skjema';
import {Hovedknapp} from 'nav-frontend-knapper';
import {Normaltekst, Undertittel} from 'nav-frontend-typografi';
import {getEvalState, setEvalState} from '../../utils/eval-state-utils';
import {AnalyticsCallback} from '../..';
import {Boks, Topp, Skjema} from './styles';

export type SurveyQuestion = {
    label: string;
    options: string[];
    type: 'radio' | 'checkbox';
    required?: boolean;
};

type SurveyAnswers = Record<string, string[]>;
type Properties = {
    analyticsCallback?: AnalyticsCallback;
    analyticsSurvey: SurveyQuestion[];
};

function findInvalidInput(
    questions: SurveyQuestion[],
    answers: SurveyAnswers
): string[] {
    const invalidFields: string[] = [];

    questions.forEach((question) => {
        const answer = answers[question.label];

        if (question.required && (!answer || answer.length === 0)) {
            invalidFields.push(question.label);
        }
    });

    return invalidFields;
}

const toggleArrayValue = (array: string[], value: string) =>
    array.includes(value)
        ? array.filter((v: any) => v !== value)
        : array.concat(value);

const Evaluering = ({analyticsCallback, analyticsSurvey}: Properties) => {
    const [surveyInput, setSurveyInput] = useState<SurveyAnswers>({});
    const [invalidInput, setInvalidInput] = useState<string[]>([]);
    const [surveySent, setSurveySent] = useState(getEvalState().sent);

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const _invalidInput = findInvalidInput(analyticsSurvey, surveyInput);

        if (_invalidInput.length > 0) {
            setInvalidInput(_invalidInput);
            return;
        }

        const evalState = getEvalState();
        setEvalState({...evalState, sent: true});
        setSurveySent(true);

        if (analyticsCallback) {
            analyticsCallback('tilbakemelding', {
                komponent: 'frida',
                veileder: Boolean(evalState.veileder),
                english: evalState.english,
                rollevalg: evalState.rollevalg,
                temavalg: evalState.temavalg
            });

            Object.entries(surveyInput).forEach(([question, answer]) =>
                analyticsCallback('tilbakemelding', {
                    komponent: 'frida',
                    spørsmål: question,
                    svar: answer
                })
            );
        }
    }

    return (
        <Boks>
            <SkjemaGruppe
                feil={
                    invalidInput.length > 0
                        ? 'Obligatoriske felt mangler'
                        : undefined
                }
            >
                <Topp>
                    {surveySent ? (
                        <Normaltekst>Takk for din tilbakemelding!</Normaltekst>
                    ) : (
                        <>
                            <Undertittel>Tilbakemelding</Undertittel>
                            <Normaltekst>
                                Jeg ønsker å lære av opplevelsen din.
                            </Normaltekst>
                        </>
                    )}
                </Topp>

                {!surveySent && (
                    <Skjema onSubmit={handleSubmit}>
                        {analyticsSurvey.map((question) => {
                            if (question.type === 'radio') {
                                return (
                                    <RadioGruppe
                                        key={question.label}
                                        legend={question.label}
                                        feil={
                                            invalidInput.includes(
                                                question.label
                                            )
                                                ? '* obligatorisk'
                                                : undefined
                                        }
                                    >
                                        {question.options.map((option) => (
                                            <Radio
                                                key={option}
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
                                                            option
                                                        ]
                                                    }));
                                                }}
                                            />
                                        ))}
                                    </RadioGruppe>
                                );
                            }

                            if (question.type === 'checkbox') {
                                return (
                                    <CheckboxGruppe
                                        key={question.label}
                                        legend={question.label}
                                        feil={
                                            invalidInput.includes(
                                                question.label
                                            )
                                                ? '* obligatorisk'
                                                : undefined
                                        }
                                    >
                                        {question.options.map((option) => (
                                            <Checkbox
                                                key={option}
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
                                                        )
                                                    }));
                                                }}
                                            />
                                        ))}
                                    </CheckboxGruppe>
                                );
                            }

                            return null;
                        })}

                        <Hovedknapp
                            kompakt
                            htmlType='submit'
                            disabled={invalidInput.length > 0}
                        >
                            Send tilbakemelding
                        </Hovedknapp>
                    </Skjema>
                )}
            </SkjemaGruppe>
        </Boks>
    );
};

export default Evaluering;
