import React, {useMemo} from 'react';
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
    revoke_consent: {
        en: 'Revoke consent',
        no: ''
    },
    processing_of_personal_data: {
        en: 'Processing of personal data',
        no: 'Behandling av personopplysninger'
    },
    consent_text_1: {
        en: '',
        no:
            'Før vi kan chatte ber vi deg lese om vår behandling av personopplysninger.'
    },
    consent_text_2: {
        en: '',
        no:
            'Dialogen lagres for å lære chatboten å bli bedre. Dette er en anonym chat hvor du kan få svar på generelle spørsmål om NAV sine ytelser og tjenester. Vi kan ikke svare på spørsmål om konkrete saker.'
    },
    consent_text_3: {
        en: '',
        no:
            'Av hensyn til din sikkerhet ber vi deg om å ikke skrive sensitive opplysninger, som for eksempel navn, fødselsnummer eller saksnummer.'
    },
    consent_text_4: {
        en: '',
        no:
            'Du kan lese <a href="https://www.nav.no/no/nav-og-samfunn/om-nav/personvern-i-arbeids-og-velferdsetaten">mer om hvordan NAV behandler personopplysninger her.</a>'
    },
    consent_text_5: {
        en: '',
        no: 'Har du lest og forstått dette?'
    },
    cancel: {
        en: 'Cancel',
        no: 'Avbryt'
    },
    yes_i_understand: {
        en: 'Yes, I understand',
        no: 'Ja, jeg forstår'
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

    return (
        <Modal
            {...{isOpen, onConfirm}}
            confirmationButtonText={localizations.revoke_consent}
            {...properties}
        >
            <ContainerElement>
                <BoxElement>
                    <TitleElement>
                        {localizations.processing_of_personal_data}
                    </TitleElement>
                    <TextElement>{localizations.consent_text_1}</TextElement>
                    <TextElement>{localizations.consent_text_2}</TextElement>
                    <TextElement>{localizations.consent_text_3}</TextElement>
                    <TextElement>
                        <span
                            // eslint-disable-next-line react/no-danger
                            dangerouslySetInnerHTML={{
                                __html: localizations.consent_text_4
                            }}
                        />
                    </TextElement>
                    <TextElement>{localizations.consent_text_5}</TextElement>

                    <ActionsElement>
                        <ButtonElement
                            mini
                            kompakt
                            tabIndex={isOpen ? undefined : -1}
                            htmlType='button'
                            type='flat'
                            onClick={onConfirm}
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
            </ContainerElement>
        </Modal>
    );
};

export default ConsentModal;
