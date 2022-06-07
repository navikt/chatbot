import React, {useMemo, useState} from 'react';
import styled from 'styled-components';
import {Knapp} from 'nav-frontend-knapper';
import useLanguage from '../contexts/language';

import Modal, {
    ModalProperties,
    BoxElement,
    TitleElement,
    TextElement,
    ActionsElement
} from './modal';

const ButtonElement = styled(Knapp)`
    margin-left: 5px;
`;

const translations = {
    deny_data_processing_consent: {
        en: 'Deny data processing consent',
        no: 'Benekt behandling av data'
    },
    processing_of_personal_data: {
        en: 'Processing of personal data',
        no: 'Behandling av personopplysninger'
    },
    consent_text_1: {
        en: 'Before you start the chat, please read <a href="https://www.nav.no/no/nav-og-samfunn/om-nav/personvern-i-arbeids-og-velferdsetaten">how we process your personal information.</a>',
        no: 'Før du starter chatten ber vi deg lese <a href="https://www.nav.no/no/nav-og-samfunn/om-nav/personvern-i-arbeids-og-velferdsetaten">hvordan vi behandler personopplysningene dine.</a>'
    },
    consent_text_2: {
        en: 'The chat will be stored and used in our work to make our chatbot better.',
        no: 'Vi lagrer chatten, og bruker den i arbeidet med å gjøre chatbot Frida bedre.'
    },
    consent_text_3: {
        en: 'To ensure your privacy it is important that you do not write personal information that may identify you or others. Personal information can for example be name, address, date of birth and case number. This also applies to you as an employer, doctor or therapist.',
        no: 'For å sikre personvernet ditt er det viktig at du ikke skriver personopplysninger som gjør at vi kan identifisere deg, eller andre, i chatten. Personopplysninger kan være for eksempel navn, fødselsdato, adresse og saksnummer. Dette gjelder også deg som arbeidsgiver, lege eller behandler.'
    },
    consent_text_4: {
        en: 'You will first chat with our chatbot Frida, but you can choose to be transfered to a human advisor without logging in (weekdays 09:00-15:00).',
        no: 'Du møter først chatbot Frida, men kan gå videre for å chatte med en veileder uten å logge inn (hverdager 09:00-15:00).'
    },
    consent_text_5: {
        en: 'Have you read and understood the information above?',
        no: 'Har du lest og forstått dette?'
    },
    cancel: {
        en: 'Cancel',
        no: 'Avbryt'
    },
    yes_i_understand: {
        en: 'Yes, I understand',
        no: 'Ja, jeg forstår'
    },
    chat_aborted: {
        en: 'Chat aborted',
        no: 'Chat avbrutt'
    },
    find_other_ways_to_contact_us: {
        en: 'Find <a href="https://www.nav.no/person/kontakt-oss/en" data-minimize="true">other ways to contact us</a>.',
        no: 'Se <a href="https://www.nav.no/person/kontakt-oss" data-minimize="true">andre måter å kontakte oss på</a>.'
    },
    close: {
        en: 'Close',
        no: 'Lukk'
    }
};

interface ConsentModalProperties extends ModalProperties {
    onCancel?: () => void;
}

const ConsentModal = ({
    isOpen,
    onConfirm,
    onCancel,
    ...properties
}: ConsentModalProperties) => {
    const {translate} = useLanguage();
    const localizations = useMemo(() => translate(translations), [translate]);
    const [isDenied, setIsDenied] = useState(false);

    function handleDeny() {
        setIsDenied(true);
    }

    function handleDenyConfirm() {
        setIsDenied(false);
        onConfirm!();
    }

    return (
        <>
            <Modal
                {...properties}
                {...{onConfirm}}
                isOpen={isOpen && !isDenied}
                confirmationButtonText={
                    localizations.deny_data_processing_consent
                }
            >
                {isOpen && !isDenied && (
                    <BoxElement>
                        <TitleElement>
                            {localizations.processing_of_personal_data}
                        </TitleElement>

                        <TextElement>
                            <span
                                // eslint-disable-next-line react/no-danger
                                dangerouslySetInnerHTML={{
                                    __html: localizations.consent_text_1
                                }}
                            />
                        </TextElement>
                        <TextElement>
                            {localizations.consent_text_2}
                        </TextElement>
                        <TextElement>
                            {localizations.consent_text_3}
                        </TextElement>
                        <TextElement>
                            {localizations.consent_text_4}
                        </TextElement>
                        <TextElement>
                            {localizations.consent_text_5}
                        </TextElement>

                        <ActionsElement>
                            <ButtonElement
                                mini
                                kompakt
                                htmlType='button'
                                type='flat'
                                onClick={handleDeny}
                            >
                                {localizations.cancel}
                            </ButtonElement>

                            <ButtonElement
                                mini
                                kompakt
                                htmlType='button'
                                type='hoved'
                                onClick={onCancel}
                            >
                                {localizations.yes_i_understand}
                            </ButtonElement>
                        </ActionsElement>
                    </BoxElement>
                )}
            </Modal>

            <Modal
                {...properties}
                {...{onConfirm}}
                isOpen={isOpen && isDenied}
                confirmationButtonText={
                    localizations.deny_data_processing_consent
                }
            >
                {isOpen && isDenied && (
                    <BoxElement>
                        <TitleElement>
                            {localizations.chat_aborted}
                        </TitleElement>
                        <TextElement>
                            <span
                                // eslint-disable-next-line react/no-danger
                                dangerouslySetInnerHTML={{
                                    __html: localizations.find_other_ways_to_contact_us
                                }}
                            />
                        </TextElement>

                        <ActionsElement>
                            <ButtonElement
                                mini
                                kompakt
                                htmlType='button'
                                type='hoved'
                                onClick={handleDenyConfirm}
                            >
                                {localizations.close}
                            </ButtonElement>
                        </ActionsElement>
                    </BoxElement>
                )}
            </Modal>
        </>
    );
};

export default ConsentModal;
