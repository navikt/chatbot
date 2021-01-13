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
            'The conversation is saved to improve our chatbot. This is an anonymous chat where you can ask general questions about NAV’s services. We can’t follow up on specific cases.',
        no:
            'Dialogen lagres for å lære chatboten å bli bedre. Dette er en anonym chat hvor du kan få svar på generelle spørsmål om NAV sine ytelser og tjenester. Vi kan ikke svare på spørsmål om konkrete saker.'
    },
    consent_text_3: {
        en:
            'For your safety, please do not write sensitive information such as name, social security number, or case numbers.',
        no:
            'Av hensyn til din sikkerhet ber vi deg om å ikke skrive sensitive opplysninger, som for eksempel navn, fødselsnummer eller saksnummer.'
    },
    consent_text_4: {
        en:
            'You can <a href="https://www.nav.no/en/nav-og-samfunn/om-nav/personvern-i-arbeids-og-velferdsetaten">read more about how we process personal data here.</a>',
        no:
            'Du kan <a href="https://www.nav.no/no/nav-og-samfunn/om-nav/personvern-i-arbeids-og-velferdsetaten">lese mer om hvordan NAV behandler personopplysninger her.</a>'
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
    you_can_find_other_ways_to_contact_us_here: {
        en:
            'You can find other ways to <a href="https://www.nav.no/person/kontakt-oss/en">contact us here.</a>',
        no:
            'Du kan se andre måter å <a href="https://www.nav.no/person/kontakt-oss">kontakte oss på her.</a>'
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
                                            localizations.you_can_find_other_ways_to_contact_us_here
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
