import React, {useMemo} from 'react';
import styled from 'styled-components';
import {Alert} from '@navikt/ds-react';
import useLanguage from '../contexts/language';
import useSession from '../contexts/session';
import Spinner, {SpinnerElement} from './spinner';

const Element = styled(Alert)`
    backdrop-filter: blur(2px);
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);

    .navds-alert__wrapper {
        flex: 1;
    }

    ${SpinnerElement} {
        svg circle {
            stroke: rgba(0, 0, 0, 0.1);
        }

        svg circle:last-child {
            stroke: rgba(0, 0, 0, 0.5);
        }
    }
`;

const ContentsElement = styled.div`
    display: flex;
`;

const TextElement = styled.span`
    flex: 1;
`;

const translations = {
    connecting: {
        en: 'Connecting...',
        no: 'Kobler til...'
    },
    restarting: {
        en: 'Restarting...',
        no: 'Starter på nytt...'
    },
    conversation_ended: {
        en: 'The conversation has ended.',
        no: 'Samtalen er avsluttet.'
    },
    network_error: {
        en: 'We are having connection issues. Please check your network settings, and try again.',
        no: 'Vi får ikke kontakt. Vennligst sjekk internettilkoblingen din og prøv igjen.'
    },
    error: {
        en: 'Something went wrong.',
        no: 'Det har skjedd en feil.'
    },
    waiting_for_human: {
        en: 'Waiting for an available agent...',
        no: 'Venter på ledig veileder...'
    }
};

const StatusStrip = () => {
    const {translate} = useLanguage();
    const {conversation, error, status} = useSession();
    const localizations = useMemo(() => translate(translations), [translate]);
    const conversationStatus = conversation?.state.chat_status;

    switch (status) {
        case 'connecting': {
            return (
                <div>
                    <Element
                        fullWidth={true}
                        inline={false}
                        size='medium'
                        variant='info'
                    >
                        <ContentsElement>
                            <TextElement>
                                {localizations.connecting}
                            </TextElement>
                            <Spinner />
                        </ContentsElement>
                    </Element>
                </div>
            );
        }

        case 'restarting': {
            return (
                <Element
                    fullWidth={true}
                    inline={false}
                    size='medium'
                    variant='warning'
                >
                    <ContentsElement>
                        <TextElement>{localizations.restarting}</TextElement>
                        <Spinner />
                    </ContentsElement>
                </Element>
            );
        }

        case 'ended': {
            return (
                <Element
                    fullWidth={true}
                    inline={false}
                    size='medium'
                    variant='success'
                >
                    <ContentsElement>
                        {localizations.conversation_ended}
                    </ContentsElement>
                </Element>
            );
        }

        case 'error': {
            if (error?.code === 'network_error') {
                return (
                    <Element
                        fullWidth={true}
                        inline={false}
                        size='medium'
                        variant='error'
                    >
                        <ContentsElement>
                            {localizations.network_error}
                        </ContentsElement>
                    </Element>
                );
            }

            return (
                <Element
                    fullWidth={true}
                    inline={false}
                    size='medium'
                    variant='error'
                >
                    <ContentsElement>{localizations.error}</ContentsElement>
                </Element>
            );
        }

        default: {
            if (conversationStatus === 'in_human_chat_queue') {
                return (
                    <Element
                        fullWidth={true}
                        inline={false}
                        size='medium'
                        variant='info'
                    >
                        <ContentsElement>
                            <TextElement>
                                {localizations.waiting_for_human}
                            </TextElement>

                            <Spinner />
                        </ContentsElement>
                    </Element>
                );
            }

            return null;
        }
    }
};

export default StatusStrip;
