import React, {useState, useMemo} from 'react';
import styled from 'styled-components';
import {Knapp} from 'nav-frontend-knapper';

import {
    RadioGruppe,
    Radio,
    CheckboxGruppe,
    Checkbox
} from 'nav-frontend-skjema';

import useLanguage from '../contexts/language';
import useSession from '../contexts/session';

import Modal, {
    ModalProperties,
    BoxElement,
    TitleElement,
    TextElement
} from './modal';

const FormElement = styled.form``;
const ActionsElement = styled.div`
    margin-top: 20px;
    display: flex;
`;

const ActionsSpacerElement = styled.div`
    flex: 1;
`;

const translations = {
    close_evaluation: {
        en: 'Close chat evaluation',
        no: 'Lukk evaluering av chat'
    },
    chat_evaluation: {
        en: 'Chat evaluation',
        no: 'Evaluering av chat'
    },
    chat_has_ended: {
        en: 'The chat has ended.',
        no: 'Chatten er avsluttet.'
    },
    consider_evaluating: {
        en: 'If you have time, please consider evaluating your experience.',
        no: 'Hvis du har tid, ønsker vi gjerne å lære av opplevelsen din.'
    },
    your_rating: {
        en: 'Were your questions answered?',
        no: 'Fikk du svar på det du lurte på?'
    },
    yes: {
        en: 'Yes',
        no: 'Ja'
    },
    no: {
        en: 'No',
        no: 'Nei'
    },
    partly: {
        en: 'Partly',
        no: 'Delvis'
    },
    what_did_you_come_to_do: {
        en: 'What did you come here to do?',
        no: 'Hva kom du hit for å gjøre?'
    },
    work: {
        en: 'Work',
        no: 'Arbeid'
    },
    family: {
        en: 'Family',
        no: 'Familie'
    },
    financial_social_assistance: {
        en: 'Financial social assistance',
        no: 'Økonomisk sosialhjelp'
    },
    health: {
        en: 'Health',
        no: 'Helse'
    },
    disability_benefits: {
        en: 'Disability benefits',
        no: 'Uføretrygd'
    },
    pensions: {
        en: 'Pensions',
        no: 'Pensjon'
    },
    employer_or_coworker: {
        en: 'Employer or co-worker',
        no: 'Arbeidsgiver eller samhandler'
    },
    more_specifically: {
        en: 'More specifically...',
        no: 'Nærmere bestemt...'
    },
    find_information_about_job_seeking: {
        en: 'Find information about job seeking',
        no: 'Finne informasjon om jobbsøking'
    },
    find_vacancies: {
        en: 'Find vacancies',
        no: 'Finne ledige stillinger'
    },
    send_report_card: {
        en: 'Send report card',
        no: 'Sende meldekort'
    },
    check_payouts: {
        en: 'Check payouts',
        no: 'Sjekke utbetalinger'
    },
    send_application: {
        en: 'Send application',
        no: 'Sende søknad'
    },
    check_status_of_my_case: {
        en: 'Check the status of my case',
        no: 'Sjekke status i saken min'
    },
    find_information_on_layoffs: {
        en: 'Find information on layoffs',
        no: 'Finne informasjon om permittering'
    },
    find_information_on_unemployment_benefits: {
        en: 'Find information on unemployment benefits',
        no: 'Finne informasjon om dagpenger'
    },
    find_information_on_work_clearance_allowance: {
        en: 'Find information on work clearance allowance',
        no: 'Finne informasjon om arbeidsavklaringspenger'
    },
    find_information_on_initiative_money: {
        en: 'Find information on initiative money',
        no: 'Finne informasjon om tiltakspenger'
    },
    check_or_update_activity_plan: {
        en: 'Check or update aktivity plan',
        no: 'Sjekke eller oppdatere aktivitetsplanen'
    },
    send_message_to_nav: {
        en: 'Send a message to NAV',
        no: 'Sende melding til NAV'
    },
    read_messages_from_nav: {
        en: 'Read messages from NAV',
        no: 'Lese meldinger fra NAV'
    },
    something_else: {
        en: 'Something else',
        no: 'Annet'
    },
    find_information_on_family_benefits: {
        en: 'Find information on family benefits',
        no: 'Finne informasjon om familieytelser'
    },
    find_information_on_financial_social_assistance: {
        en: 'Find information on financial social assistance',
        no: 'Finne informasjon om økonomisk sosialhjelp'
    },
    find_information_on_financial_counseling: {
        en: 'Find information on financial counseling',
        no: 'Finne informasjon om økonomisk rådgivning'
    },
    check_or_update_follow_up_plan: {
        en: 'Check or update the follow-up plan',
        no: 'Sjekke eller oppdatere oppfølgingsplanen'
    },
    find_information_on_sick_leave: {
        en: 'Find information on sick leave',
        no: 'Finne informasjon om sykemelding/-fravær'
    },
    find_information_on_salute_card: {
        en: 'Find information on salute cards',
        no: 'Finne informasjon om honnørkort'
    },
    find_information_on_disability_benefits: {
        en: 'Find information on disability benefits',
        no: 'Finne informasjon om uføretrygd'
    },
    find_information_on_pensions: {
        en: 'Find information on pensions',
        no: 'Finne informasjon om alderspensjon'
    },
    find_information_on_pension_benefits: {
        en: 'Find information on pension benefits',
        no: 'Finne informasjon om pensjonsytelser'
    },
    find_information_on_recruitment: {
        en: 'Find information on recruitment',
        no: 'Finne informasjon om rekruttering'
    },
    find_information_on_refunds_and_settlements: {
        en: 'Find information on refunds and settlements',
        no: 'Finne informasjon om refusjoner og oppgjør'
    },
    find_information_on_a_benefit_or_scheme: {
        en: 'Find information on a benefit or scheme',
        no: 'Finne informasjon om en stønad eller ordning'
    },
    find_news_or_statistics: {
        en: 'Find news or statistics',
        no: 'Finne nyheter eller statistikk'
    },
    was_the_interaction_pleasant: {
        en: 'Did you find your interaction with us pleasant?',
        no: 'Ble du møtt på en hyggelig måte i kontakt med oss?'
    },
    submit: {
        en: 'Submit',
        no: 'Send inn'
    }
};

interface EvaluationModalProperties extends ModalProperties {
    onFeedback?: (key: string, data: Record<string, unknown>) => void;
}

interface InputProperties {
    localizationId: string;
}

interface RatingRadioProperties extends InputProperties {}
interface AreaRadioProperties extends InputProperties {}
interface ReasonCheckboxProperties extends InputProperties {}
interface SatisfactionRadioProperties extends InputProperties {}

const EvaluationModal = ({
    isOpen,
    onFeedback,
    onConfirm,
    ...properties
}: EvaluationModalProperties) => {
    const {language, translate} = useLanguage();
    const {sendFeedback} = useSession();
    const [rating, setRating] = useState<string>();
    const [satisfaction, setSatisfaction] = useState<string>();
    const [area, setArea] = useState<string>();
    const [reasons, setReasons] = useState<string[]>([]);
    const localizations = useMemo(() => translate(translations), [translate]);

    function handleRatingClick(event: React.MouseEvent) {
        const target = event.target as HTMLInputElement;

        if (target.checked) {
            setRating(target.value);
        }
    }

    function handleAreaClick(event: React.MouseEvent) {
        const target = event.target as HTMLInputElement;

        if (target.checked) {
            setArea((previousArea) => {
                if (previousArea !== target.value) {
                    setReasons([]);
                }

                return target.value;
            });
        }
    }

    function handleReasonClick(event: React.MouseEvent) {
        const target = event.target as HTMLInputElement;

        if (target.checked) {
            setReasons((previousState) => previousState.concat(target.value));
        } else {
            setReasons((previousState) =>
                previousState.filter((value) => value !== target.value)
            );
        }
    }

    function handleSatisfactionClick(event: React.MouseEvent) {
        const target = event.target as HTMLInputElement;

        if (target.checked) {
            setSatisfaction(target.value);
        }
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (rating) {
            void sendFeedback!(Math.round(Number.parseInt(rating, 10)));
        }

        if (onFeedback) {
            onFeedback('tilbakemelding', {
                komponent: 'chatbot-test',
                isEnglish: language === 'en',
                responses: {rating, area, reasons, satisfaction}
            });
        }

        onConfirm!();
    }

    const RatingRadio = ({localizationId}: RatingRadioProperties) => (
        <Radio
            readOnly
            name={localizations[localizationId]}
            label={localizations[localizationId]}
            value={translations[localizationId].no}
            checked={rating === translations[localizationId].no}
            onClick={handleRatingClick}
        />
    );

    const AreaRadio = ({localizationId}: AreaRadioProperties) => (
        <Radio
            readOnly
            label={localizations[localizationId]}
            value={translations[localizationId].no}
            name={`area-${String(translations[localizationId].no)}`}
            checked={area === translations[localizationId].no}
            onClick={handleAreaClick}
        />
    );

    const ReasonCheckbox = ({localizationId}: ReasonCheckboxProperties) => (
        <Checkbox
            readOnly
            label={localizations[localizationId]}
            value={translations[localizationId].no}
            checked={reasons.includes(translations[localizationId].no)}
            onClick={handleReasonClick}
        />
    );

    const ReasonCheckboxGroup = () => {
        if (!area) {
            return null;
        }

        let checkboxes;

        switch (area) {
            case translations.work.no: {
                checkboxes = (
                    <>
                        <ReasonCheckbox localizationId='find_information_about_job_seeking' />
                        <ReasonCheckbox localizationId='find_vacancies' />
                        <ReasonCheckbox localizationId='send_report_card' />
                        <ReasonCheckbox localizationId='check_payouts' />
                        <ReasonCheckbox localizationId='send_application' />
                        <ReasonCheckbox localizationId='check_status_of_my_case' />
                        <ReasonCheckbox localizationId='find_information_on_layoffs' />
                        <ReasonCheckbox localizationId='find_information_on_unemployment_benefits' />
                        <ReasonCheckbox localizationId='find_information_on_work_clearance_allowance' />
                        <ReasonCheckbox localizationId='find_information_on_initiative_money' />
                        <ReasonCheckbox localizationId='check_or_update_activity_plan' />
                        <ReasonCheckbox localizationId='send_message_to_nav' />
                        <ReasonCheckbox localizationId='read_messages_from_nav' />
                        <ReasonCheckbox localizationId='something_else' />
                    </>
                );

                break;
            }

            case translations.family.no: {
                checkboxes = (
                    <>
                        <ReasonCheckbox localizationId='send_application' />
                        <ReasonCheckbox localizationId='check_payouts' />
                        <ReasonCheckbox localizationId='check_status_of_my_case' />
                        <ReasonCheckbox localizationId='find_information_on_family_benefits' />
                        <ReasonCheckbox localizationId='send_message_to_nav' />
                        <ReasonCheckbox localizationId='read_messages_from_nav' />
                        <ReasonCheckbox localizationId='something_else' />
                    </>
                );

                break;
            }

            case translations.financial_social_assistance.no: {
                checkboxes = (
                    <>
                        <ReasonCheckbox localizationId='send_application' />
                        <ReasonCheckbox localizationId='find_information_on_financial_social_assistance' />
                        <ReasonCheckbox localizationId='find_information_on_financial_counseling' />
                        <ReasonCheckbox localizationId='something_else' />
                    </>
                );

                break;
            }

            case translations.health.no: {
                checkboxes = (
                    <>
                        <ReasonCheckbox localizationId='send_report_card' />
                        <ReasonCheckbox localizationId='send_application' />
                        <ReasonCheckbox localizationId='check_status_of_my_case' />
                        <ReasonCheckbox localizationId='check_payouts' />
                        <ReasonCheckbox localizationId='check_or_update_follow_up_plan' />
                        <ReasonCheckbox localizationId='find_information_on_sick_leave' />
                        <ReasonCheckbox localizationId='find_information_on_work_clearance_allowance' />
                        <ReasonCheckbox localizationId='send_message_to_nav' />
                        <ReasonCheckbox localizationId='read_messages_from_nav' />
                        <ReasonCheckbox localizationId='something_else' />
                    </>
                );

                break;
            }

            case translations.disability_benefits.no: {
                checkboxes = (
                    <>
                        <ReasonCheckbox localizationId='send_application' />
                        <ReasonCheckbox localizationId='check_status_of_my_case' />
                        <ReasonCheckbox localizationId='check_payouts' />
                        <ReasonCheckbox localizationId='find_information_on_salute_card' />
                        <ReasonCheckbox localizationId='find_information_on_disability_benefits' />
                        <ReasonCheckbox localizationId='send_message_to_nav' />
                        <ReasonCheckbox localizationId='read_messages_from_nav' />
                        <ReasonCheckbox localizationId='something_else' />
                    </>
                );

                break;
            }

            case translations.pensions.no: {
                checkboxes = (
                    <>
                        <ReasonCheckbox localizationId='send_application' />
                        <ReasonCheckbox localizationId='check_status_of_my_case' />
                        <ReasonCheckbox localizationId='check_payouts' />
                        <ReasonCheckbox localizationId='find_information_on_pensions' />
                        <ReasonCheckbox localizationId='find_information_on_pension_benefits' />
                        <ReasonCheckbox localizationId='send_message_to_nav' />
                        <ReasonCheckbox localizationId='read_messages_from_nav' />
                        <ReasonCheckbox localizationId='something_else' />
                    </>
                );

                break;
            }

            case translations.employer_or_coworker.no: {
                checkboxes = (
                    <>
                        <ReasonCheckbox localizationId='send_application' />
                        <ReasonCheckbox localizationId='find_information_on_layoffs' />
                        <ReasonCheckbox localizationId='find_information_on_sick_leave' />
                        <ReasonCheckbox localizationId='find_information_on_recruitment' />
                        <ReasonCheckbox localizationId='find_information_on_refunds_and_settlements' />
                        <ReasonCheckbox localizationId='something_else' />
                    </>
                );

                break;
            }

            case translations.something_else.no: {
                checkboxes = (
                    <>
                        <ReasonCheckbox localizationId='send_application' />
                        <ReasonCheckbox localizationId='find_news_or_statistics' />
                        <ReasonCheckbox localizationId='find_news_or_statistics' />
                        <ReasonCheckbox localizationId='something_else' />
                    </>
                );

                break;
            }

            default: {
                return null;
            }
        }

        return (
            <CheckboxGruppe legend={localizations.more_specifically}>
                {checkboxes}
            </CheckboxGruppe>
        );
    };

    const SatisfactionRadio = ({
        localizationId
    }: SatisfactionRadioProperties) => (
        <Radio
            readOnly
            label={localizations[localizationId]}
            value={translations[localizationId].no}
            name={`satisfaction-${String(translations[localizationId].no)}`}
            checked={satisfaction === translations[localizationId].no}
            onClick={handleSatisfactionClick}
        />
    );

    return (
        <Modal
            {...properties}
            {...{isOpen, onConfirm}}
            confirmationButtonText={localizations.close_evaluation}
        >
            {isOpen && (
                <BoxElement>
                    <FormElement onSubmit={handleSubmit}>
                        <TitleElement>
                            {localizations.chat_has_ended}
                        </TitleElement>
                        <TextElement>
                            {localizations.consider_evaluating}
                        </TextElement>

                        <RadioGruppe legend={localizations.your_rating}>
                            <RatingRadio localizationId='yes' />
                            <RatingRadio localizationId='partly' />
                            <RatingRadio localizationId='no' />
                        </RadioGruppe>

                        {onFeedback && (
                            <RadioGruppe
                                legend={
                                    localizations.was_the_interaction_pleasant
                                }
                            >
                                <SatisfactionRadio localizationId='yes' />
                                <SatisfactionRadio localizationId='partly' />
                                <SatisfactionRadio localizationId='no' />
                            </RadioGruppe>
                        )}

                        {onFeedback && (
                            <RadioGruppe
                                legend={localizations.what_did_you_come_to_do}
                            >
                                <AreaRadio localizationId='work' />
                                <AreaRadio localizationId='family' />
                                <AreaRadio localizationId='financial_social_assistance' />
                                <AreaRadio localizationId='health' />
                                <AreaRadio localizationId='disability_benefits' />
                                <AreaRadio localizationId='pensions' />
                                <AreaRadio localizationId='employer_or_coworker' />
                                <AreaRadio localizationId='something_else' />
                            </RadioGruppe>
                        )}

                        {onFeedback && <ReasonCheckboxGroup />}

                        <ActionsElement>
                            <ActionsSpacerElement />
                            <Knapp kompakt mini htmlType='submit' type='hoved'>
                                {localizations.submit}
                            </Knapp>
                        </ActionsElement>
                    </FormElement>
                </BoxElement>
            )}
        </Modal>
    );
};

export default EvaluationModal;
