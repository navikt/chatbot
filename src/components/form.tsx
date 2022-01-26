import React, {useCallback, useEffect, useMemo, useState} from 'react';
import styled from 'styled-components';
import {Textarea} from 'nav-frontend-skjema';
import {Knapp as Button} from 'nav-frontend-knapper';
import useDebouncedEffect from '../hooks/use-debounced-effect';
import useSession from '../contexts/session';
import useLanguage from '../contexts/language';
import AriaLabelElement from './aria-label';
import TextareaCounter from './textarea-counter';

const FormElement = styled.form`
    background: #f4f4f4;
    border-top: 1px solid #78706a;
    box-shadow: inset 0 1px 0 #fff;
`;

const PaddingElement = styled.div`
    padding: 14px 12px;
    padding-bottom: calc(env(safe-area-inset-bottom) + 12px);
    box-sizing: border-box;

    .textarea__container {
        width: auto;
    }

    textarea {
        min-height: 65px;
    }
`;

const ActionsElement = styled.div`
    margin-top: 10px;
    display: flex;
    flex-direction: row-reverse;
`;

const RestartButtonElement = styled(Button)`
    background: none;
    padding: 0 15px;
    margin-right: 10px;
`;

const translations = {
    your_message: {
        en: 'Your message',
        no: 'Din melding'
    },
    send: {
        en: 'Send',
        no: 'Send'
    },
    _message: {
        en: 'message',
        no: 'melding'
    },
    ask_your_question: {
        en: 'Ask your question',
        no: 'Still ditt spørsmål'
    },
    restart: {
        en: 'Restart',
        no: 'Start på nytt'
    }
};

interface FormProperties {
    isObscured?: boolean;
    onSubmit?: (message: string) => void;
    onRestart?: () => void;
}

const Form = ({isObscured, onSubmit, onRestart}: FormProperties) => {
    const {translate} = useLanguage();
    const {id, conversation, responses, queue, sendPing} = useSession();
    const localizations = useMemo(() => translate(translations), [translate]);
    const [message, setMessage] = useState<string>(
        sessionStorage.getItem('chatbotMessage') || ''
    );
    const conversationStatus = conversation?.state.chat_status;
    const messageMaxCharacters = conversation?.state.max_input_chars ?? 110;

    function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        setMessage(event.target.value);
    }

    const handleSubmit = useCallback(
        (event?: React.FormEvent<HTMLFormElement>) => {
            event?.preventDefault();

            if (message && message.length <= messageMaxCharacters) {
                setMessage('');
                onSubmit!(message);
            }
        },
        [message, messageMaxCharacters, onSubmit]
    );

    const handleKeyDown = useCallback(
        (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (event.key.toLowerCase() === 'enter' && !event.shiftKey) {
                event.preventDefault();
                handleSubmit();
            }
        },
        [handleSubmit]
    );

    useEffect(() => {
        sessionStorage.setItem('chatbotMessage', message);
    }, [message]);

    useDebouncedEffect(
        2000,
        () => {
            if (id && message) {
                void sendPing!();
            }
        },
        [message]
    );

    const responsesLength = (responses?.length ?? 0) + (queue ? 1 : 0);

    return (
        <FormElement aria-hidden={isObscured} onSubmit={handleSubmit}>
            <PaddingElement>
                <Textarea
                    name='message'
                    value={message}
                    placeholder={
                        responsesLength <= 1
                            ? localizations.ask_your_question
                            : undefined
                    }
                    maxLength={messageMaxCharacters}
                    tabIndex={isObscured ? -1 : undefined}
                    tellerTekst={(count, maxCount) => (
                        <TextareaCounter {...{count, maxCount}} />
                    )}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                />

                <ActionsElement>
                    <Button
                        htmlType='submit'
                        tabIndex={isObscured ? -1 : undefined}
                    >
                        {localizations.send}{' '}
                        <AriaLabelElement>
                            {localizations._message}
                        </AriaLabelElement>
                    </Button>

                    {conversationStatus === 'virtual_agent' && (
                        <RestartButtonElement
                            mini
                            htmlType='button'
                            type='flat'
                            tabIndex={isObscured ? -1 : undefined}
                            onClick={onRestart}
                        >
                            {localizations.restart}
                        </RestartButtonElement>
                    )}
                </ActionsElement>
            </PaddingElement>
        </FormElement>
    );
};

export default Form;
