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

const ContainerElement = styled.div`
    margin: auto;
`;

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
        en:
            'Before we can start chatting, please read about our processing of personal data.',
        no:
            'Før vi kan chatte ber vi deg lese om vår behandling av personopplysninger.'
    },
    consent_text_2: {
        en:
            'The conversation is saved to improve our chatbot. This is an anonymous chat where you can ask general questions about NAV’s services. For questions on a specific case, ask to speak with an agent and identify yourself with BankID.',
        no:
            'Dialogen lagres for å lære chatboten å bli bedre. Dette er en anonym chat hvor du kan få svar på generelle spørsmål om NAV sine ytelser og tjenester. For spørsmål om en konkret sak må du be om å bli satt over til en veileder og identifisere deg med BankID.'
    },
    consent_text_3: {
        en:
            'For your safety, please do not write sensitive information such as name, social security number, or case numbers.',
        no:
            'Av hensyn til din sikkerhet ber vi deg om å ikke skrive sensitive opplysninger, som for eksempel navn, fødselsnummer eller saksnummer.'
    },
    consent_text_4: {
        en:
            'Read more about <a href="https://www.nav.no/en/nav-og-samfunn/om-nav/personvern-i-arbeids-og-velferdsetaten">how we process personal data</a>.',
        no:
            'Les mer om <a href="https://www.nav.no/no/nav-og-samfunn/om-nav/personvern-i-arbeids-og-velferdsetaten">hvordan NAV behandler personopplysninger</a>.'
    },
    consent_text_5: {
        en: 'Have you read and understood this?',
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
        en:
            'Find <a href="https://www.nav.no/person/kontakt-oss/en">other ways to contact us</a>.',
        no:
            'Se <a href="https://www.nav.no/person/kontakt-oss">andre måter å kontakte oss på</a>.'
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
                <ContainerElement>
                    {isOpen && !isDenied && (
                        <BoxElement>
                            <TitleElement>
                                {localizations.processing_of_personal_data}
                            </TitleElement>

                            <TextElement>
                                {localizations.consent_text_1}
                            </TextElement>
                            <TextElement>
                                {localizations.consent_text_2}
                            </TextElement>
                            <TextElement>
                                {localizations.consent_text_3}
                            </TextElement>
                            <TextElement>
                                <span
                                    // eslint-disable-next-line react/no-danger
                                    dangerouslySetInnerHTML={{
                                        __html: localizations.consent_text_4
                                    }}
                                />
                            </TextElement>
                            <TextElement>
                                {localizations.consent_text_5}
                            </TextElement>

                            <ActionsElement>
                                <ButtonElement
                                    mini
                                    kompakt
                                    tabIndex={isOpen ? undefined : -1}
                                    htmlType='button'
                                    type='flat'
                                    onClick={handleDeny}
                                >
                                    {localizations.cancel}
                                </ButtonElement>

                                <ButtonElement
                                    mini
                                    kompakt
                                    tabIndex={isOpen ? undefined : -1}
                                    htmlType='button'
                                    type='hoved'
                                    onClick={onCancel}
                                >
                                    {localizations.yes_i_understand}
                                </ButtonElement>
                            </ActionsElement>
                        </BoxElement>
                    )}
                </ContainerElement>
            </Modal>

            <Modal
                {...properties}
                {...{onConfirm}}
                isOpen={isOpen && isDenied}
                confirmationButtonText={
                    localizations.deny_data_processing_consent
                }
            >
                <ContainerElement>
                    {isOpen && isDenied && (
                        <BoxElement>
                            <TitleElement>
                                {localizations.chat_aborted}
                            </TitleElement>
                            <TextElement>
                                <span
                                    // eslint-disable-next-line react/no-danger
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            localizations.find_other_ways_to_contact_us
                                    }}
                                />
                            </TextElement>

                            <ActionsElement>
                                <ButtonElement
                                    mini
                                    kompakt
                                    tabIndex={isDenied ? undefined : -1}
                                    htmlType='button'
                                    type='hoved'
                                    onClick={handleDenyConfirm}
                                >
                                    {localizations.close}
                                </ButtonElement>
                            </ActionsElement>
                        </BoxElement>
                    )}
                </ContainerElement>
            </Modal>
        </>
    );
};

export default ConsentModal;
