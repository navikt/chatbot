import { getCookie, setCookie } from '../../utils/cookies';
import { chatStateKeys } from '../../utils/stateUtils';
import {
    Checkbox,
    CheckboxGruppe,
    Radio,
    RadioGruppe,
    SkjemaGruppe,
} from 'nav-frontend-skjema';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Hovedknapp } from 'nav-frontend-knapper';
import { SurveyData, SurveyQuestion, defaultSurvey } from './surveyFields';
import { MessageWithIndicator } from '../ChatContainer';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { Container, Header, SurveyForm } from './styles';
import { AnalyticsCallback } from '../../index';

type Props = {
    baseUrl: string;
    sessionId: string;
    queueKey: string;
    nickName?: string;
    handterMelding: (melding: MessageWithIndicator, oppdater: boolean) => void;
    analyticsCallback?: AnalyticsCallback;
    analyticsSurvey?: SurveyQuestion[];
};

const toggleArrayValue = (arr: string[], value: string) =>
    arr.includes(value)
        ? arr.filter((v: any) => v !== value)
        : arr.concat(value);

const createSurveySessionAndFetchKey = (
    baseUrl: string,
    queueKey: string,
    sessionId: string
) => axios.post(`${baseUrl}/sessions/${sessionId}/survey`, {});

const sendSurvey = (
    baseUrl: string,
    queueKey: string,
    sessionId: string,
    surveyKey: string,
    surveyData: SurveyData,
    nickName?: string
) =>
    axios.post(`${baseUrl}/sessions/${sessionId}/survey`, {
        parentSessionId: surveyKey,
        surveyResult: surveyData,
        note: 'Obs: dette er kun test-data!',
    });

export const Evaluering = ({
    baseUrl,
    queueKey,
    sessionId,
    nickName = 'Bruker',
    handterMelding,
    analyticsCallback,
    analyticsSurvey = defaultSurvey,
}: Props) => {
    const [surveyKey, setSurveyKey] = useState();
    const [surveyInput, setSurveyInput] = useState<SurveyData>({});
    const [surveySent, setSurveySent] = useState(false);

    console.log(analyticsSurvey);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSurveySent(true);
        console.log(surveyInput);

        if (analyticsCallback) {
            analyticsCallback('chatbot-tilbakemelding', surveyInput);
        }

        if (surveyKey) {
            sendSurvey(
                baseUrl,
                queueKey,
                sessionId,
                surveyKey!,
                surveyInput,
                nickName
            )
                .then(() => {
                    setCookie(chatStateKeys.EVAL, surveyInput);
                    const max = Number.MAX_SAFE_INTEGER - 1000;
                    const min = Number.MAX_SAFE_INTEGER - 100000;
                    handterMelding(
                        {
                            id:
                                Math.floor(Math.random() * (max - min + 1)) +
                                min,
                            nickName: nickName,
                            sent: new Date().toString(),
                            role: 0,
                            userId: 0,
                            type: 'Evaluation',
                            content: surveyInput,
                            showIndicator: false,
                        },
                        true
                    );
                })
                .catch((e) =>
                    console.error(`Error while sending survey data: ${e}`)
                );
        }
    };

    useEffect(() => {
        if (!getCookie(chatStateKeys.EVAL)) {
            createSurveySessionAndFetchKey(
                baseUrl,
                queueKey,
                sessionId
            ).then((res) => setSurveyKey(res.data));
        }
    }, []);

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
                        {analyticsSurvey.map((fieldSet) => {
                            if (fieldSet.type === 'radio') {
                                return (
                                    <RadioGruppe
                                        legend={fieldSet.label}
                                        key={fieldSet.event}
                                    >
                                        {fieldSet.options.map((option) => (
                                            <Radio
                                                label={option}
                                                name={fieldSet.event}
                                                onClick={() =>
                                                    setSurveyInput((state) => ({
                                                        ...state,
                                                        [fieldSet.event]: [
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
                                        key={fieldSet.event}
                                    >
                                        {fieldSet.options.map((option) => (
                                            <Checkbox
                                                label={option}
                                                name={fieldSet.event}
                                                onClick={() => {
                                                    setSurveyInput((state) => ({
                                                        ...state,
                                                        [fieldSet.event]: toggleArrayValue(
                                                            state[
                                                                fieldSet.event
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
