import React, {useEffect, useMemo, useState} from 'react';
import styled, {css} from 'styled-components';
import {Normaltekst, Undertekst} from 'nav-frontend-typografi';
import fridaIcon from '../assets/frida.svg';
import useSession from '../contexts/session';
import useLanguage from '../contexts/language';
import {messagePromptCacheName} from '../configuration';
import AriaLabelElement from './aria-label';
import {MessageBubbleLeft} from './message';

const openButtonAvatarSizeNumber = 70;
const openButtonAvatarSize = `${openButtonAvatarSizeNumber}px`;

interface ButtonElementProperties {
    isVisible?: boolean;
}

const ButtonElement = styled.button`
    appearance: none;
    background: #fff;
    padding: 8px 15px;
    padding-right: ${openButtonAvatarSizeNumber / 3.5}px;
    margin-right: ${openButtonAvatarSizeNumber / 3}px;
    margin-bottom: ${openButtonAvatarSizeNumber / 6}px;
    position: fixed;
    bottom: 8px;
    right: 8px;
    z-index: 998;
    border: 0;
    cursor: pointer;
    border-radius: 30px;
    transform: ${(properties: ButtonElementProperties) =>
        properties.isVisible
            ? css`scale(1)`
            : css`scale(0.8) translate3d(0,${
                  openButtonAvatarSizeNumber * 2
              }px,0)`};
    opacity: ${(properties: ButtonElementProperties) =>
        properties.isVisible ? '1' : '0'};
    transition: ${(properties: ButtonElementProperties) =>
        properties.isVisible
            ? css`transform 0.5s, opacity 0.2s 0.3s`
            : css`transform 0.2s, opacity 0.1s`};
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.4),
        0 0 0 5px var(--navds-global-color-purple-500),
        0 1px 4px rgba(0, 0, 0, 0.5), 0 4px 10px #000,
        0 0 0 6px rgba(0, 0, 0, 0.1);

    @media (hover: hover) {
        &:hover {
            background-color: var(--navds-global-color-purple-500);
            box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.6), 0 0 0 5px #fff,
                0 4px 10px #000, 0 0 0 6px rgba(0, 0, 0, 0.1);
        }
    }

    &:focus {
        background: var(--navds-global-color-purple-500);
        outline: none;
        box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.6), 0 0 0 5px #fff,
            0 4px 10px #000, 0 0 0 6px rgba(0, 0, 0, 0.1);
    }

    @media (min-width: 480px) {
        margin-right: ${openButtonAvatarSizeNumber / 2}px;
        margin-bottom: ${openButtonAvatarSizeNumber / 5}px;
        padding: 8px 15px;
        bottom: 17px;
        right: 17px;
    }

    @media (min-width: 580px) {
        bottom: 25px;
        right: 25px;
    }
`;

const TextElement = styled(Normaltekst)`
    font-size: 18px;
    padding-right: ${openButtonAvatarSizeNumber / 2}px;
    color: #000;
    line-height: 1.4em;
    display: inline-block;
    vertical-align: top;

    ${ButtonElement}:focus &, ${ButtonElement}:hover & {
        color: #fff;
    }
`;

const AvatarElement = styled.div`
    width: ${openButtonAvatarSizeNumber - 10}px;
    height: ${openButtonAvatarSizeNumber - 10}px;
    position: absolute;
    top: 50%;
    right: -${openButtonAvatarSizeNumber / 3}px;
    transform: translateY(-50%);
    transition: transform 0.2s;
    display: inline-block;
    vertical-align: top;

    ${ButtonElement}:hover & {
        transform: translateY(-50%) scale(1.1);
    }

    svg {
        width: 100%;
        height: 100%;
        border-radius: ${openButtonAvatarSize};
    }

    &:before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.4),
            0 0 0 6px var(--navds-global-color-purple-500), 0 0 0 5px #fff,
            0 0 1px 5px rgba(0, 0, 0, 0.2), 0 4px 10px #000,
            10px 10px 10px rgba(0, 0, 0, 0.3);
        border-radius: ${openButtonAvatarSize};
    }

    @media (hover: hover) {
        ${ButtonElement}:hover &:before {
            box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.4),
                0 0 0 6px var(--navds-global-color-purple-500), 0 0 0 6px #fff,
                0 0 1px 5px rgba(0, 0, 0, 0.2), 0 4px 10px #000,
                10px 10px 10px rgba(0, 0, 0, 0.3);
        }
    }

    ${ButtonElement}:focus &:before {
        box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.3),
            0 0 0 6px var(--navds-global-color-purple-500), 0 4px 10px #000,
            0 0 0 4px #5c4378, 010px 10px 10px rgba(0, 0, 0, 0.3);
    }

    @media (min-width: 480px) {
        width: ${openButtonAvatarSize};
        height: ${openButtonAvatarSize};
        right: -${openButtonAvatarSizeNumber / 2}px;
    }
`;

const UnreadCountElement = styled(Undertekst)`
    background: #544066;
    width: 21px;
    height: 21px;
    text-align: center;
    color: #fff;
    border-radius: 21px;
    position: absolute;
    top: 50%;
    right: -${openButtonAvatarSizeNumber / 2}px;
    transform: translateY(-${openButtonAvatarSizeNumber / 2}px);
    transition: transform 0.2s;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.3),
        0 0 0 2px rgba(255, 255, 255, 1);
    pointer-events: none;

    &:empty {
        transform: translateY(-${openButtonAvatarSizeNumber / 2}px) scale(0);
    }
`;

const translations = {
    open_chat: {
        en: 'Open chat',
        no: 'Åpne chat'
    },
    chat_with_us: {
        en: 'Chat with us',
        no: 'Chat med oss'
    },
    _unread_message: {
        en: 'unread message',
        no: 'ulest melding'
    },
    _unread_messages: {
        en: 'unread messages',
        no: 'uleste meldinger'
    },
    hi_what_can_i_help_you_with: {
        en: 'Hi! What can I help you with?',
        no: 'Hei! Hva kan jeg hjelpe deg med?'
    }
};

interface MessageBubbleContainerProperties {
    isVisible?: boolean;
}

const MessageBubbleContainer = styled.div`
    width: 90%;
    max-width: 340px;
    position: fixed;
    bottom: ${8 + openButtonAvatarSizeNumber}px;
    right: ${8 + openButtonAvatarSizeNumber}px;
    text-align: right;

    pointer-events: ${(properties: MessageBubbleContainerProperties) =>
        properties.isVisible ? 'all' : 'none'};
    transform: ${(properties: MessageBubbleContainerProperties) =>
        properties.isVisible
            ? css`scale(1)`
            : css`scale(0.8) translate3d(0,${
                  openButtonAvatarSizeNumber * 2
              }px,0)`};
    opacity: ${(properties: MessageBubbleContainerProperties) =>
        properties.isVisible ? '1' : '0'};
    transition: ${(properties: MessageBubbleContainerProperties) =>
        properties.isVisible
            ? css`transform 0.5s, opacity 0.2s 0.3s`
            : css`transform 0.2s, opacity 0.1s`};

    @media (min-width: 480px) {
        bottom: ${20 + openButtonAvatarSizeNumber}px;
        right: ${20 + openButtonAvatarSizeNumber}px;
    }

    @media (min-width: 580px) {
        bottom: ${30 + openButtonAvatarSizeNumber}px;
        right: ${30 + openButtonAvatarSizeNumber}px;
    }
`;

const MessageBubble = styled(MessageBubbleLeft)`
    --border-color: rgba(0, 0, 0, 0.3);

    border-radius: 20px;
    text-align: left;
    line-height: 1em;
    padding: 12px 14px;
    cursor: pointer;
    box-shadow: inset 0 0 0 1px var(--border-color),
        0 1px 4px rgba(0, 0, 0, 0.03), 0 4px 10px rgba(0, 0, 0, 0.07),
        0 0 0 3px #fff;

    &:before {
        right: -7px;
        left: auto;
        box-shadow: inset 0 0 0 1px var(--border-color);
    }

    &:after {
        right: -2px;
        left: auto;
        border-width: 0 1px 1px 0;
        border-color: var(--border-color);
    }

    @media (hover: hover) {
        &:hover {
            background-color: #e8ebeb;
            --border-color: rgba(0, 0, 0, 0.5);
        }
    }
`;

const MessageBubbleText = styled(TextElement)`
    font-size: 16px;
    color: #000;
    line-height: 1.2em;
    padding-right: 14px;
`;

const MessagePrompt = ({
    isVisible,
    label
}: {
    isVisible?: boolean;
    label?: string;
}) => {
    const {language, translate} = useLanguage();
    const localizations = useMemo(() => translate(translations), [translate]);

    return (
        <MessageBubbleContainer aria-hidden tabIndex={-1} isVisible={isVisible}>
            <label htmlFor='chatbot-frida-knapp'>
                <MessageBubble isThinking>
                    <MessageBubbleText tag='div' lang={language}>
                        {label}
                    </MessageBubbleText>
                </MessageBubble>
            </label>
        </MessageBubbleContainer>
    );
};

function setMessagePromptCache(wasDisplayed: boolean) {
    if (window.sessionStorage) {
        window.sessionStorage.setItem(
            messagePromptCacheName,
            JSON.stringify(wasDisplayed)
        );
    }
}

function getMessagePromptCache(): boolean | undefined {
    if (window.sessionStorage) {
        const data = window.sessionStorage.getItem(messagePromptCacheName);

        if (data) {
            try {
                return JSON.parse(data);
            } catch (error) {
                console.error(error);
            }
        }
    }

    return undefined;
}

interface OpenButtonProperties {
    isOpen: boolean;
    isOpening: boolean;
    unreadCount: number;
    onClick: () => void;
}

const OpenButton = ({
    isOpen,
    isOpening,
    unreadCount,
    onClick
}: OpenButtonProperties) => {
    const {language, translate} = useLanguage();
    const {status} = useSession();
    const localizations = useMemo(() => translate(translations), [translate]);
    const label =
        status === 'connected'
            ? localizations.open_chat
            : localizations.chat_with_us;
    const isVisible = Boolean(!isOpen && !isOpening);
    const [isMessagePromptVisible, setIsMessagePromptVisible] = useState(false);
    const [internalUnreadCount, setInternalUnreadCount] = useState(unreadCount);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const wasDisplayed = getMessagePromptCache();

            if (isVisible) {
                if (!wasDisplayed && !(window.innerWidth < 1280)) {
                    let timeout = setTimeout(() => {
                        setMessagePromptCache(true);
                        setIsMessagePromptVisible(isVisible);

                        timeout = setTimeout(() => {
                            setInternalUnreadCount((previousState) =>
                                previousState === 0 ? 1 : previousState
                            );
                        }, 200);
                        timeout = setTimeout(() => {
                            setIsMessagePromptVisible(false);
                        }, 2000);
                    }, 5000);

                    return () => {
                        clearTimeout(timeout);
                    };
                }
            } else {
                setIsMessagePromptVisible(isVisible);
            }
        }

        return undefined;
    }, [isVisible]);

    useEffect(() => {
        setInternalUnreadCount(unreadCount);
    }, [unreadCount]);

    return (
        <>
            <ButtonElement
                id='chatbot-frida-knapp' // Required for external onclick
                type='button'
                lang={language}
                isVisible={isVisible}
                aria-hidden={isOpen}
                tabIndex={isOpen ? -1 : 0}
                {...{onClick}}
            >
                <TextElement>
                    {label}
                    <AriaLabelElement>.</AriaLabelElement>
                </TextElement>

                <AvatarElement
                    dangerouslySetInnerHTML={{
                        __html: fridaIcon
                    }}
                />

                <UnreadCountElement>
                    {internalUnreadCount > 0 &&
                        `${
                            internalUnreadCount > 9 ? '9' : internalUnreadCount
                        }`}
                </UnreadCountElement>

                {internalUnreadCount > 0 && (
                    <AriaLabelElement>
                        {internalUnreadCount === 1
                            ? localizations._unread_message
                            : localizations._unread_messages}
                    </AriaLabelElement>
                )}
            </ButtonElement>

            <MessagePrompt isVisible={isMessagePromptVisible} label={label} />
        </>
    );
};

export default OpenButton;
