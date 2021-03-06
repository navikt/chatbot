import React, {useMemo} from 'react';
import styled, {css} from 'styled-components';
import {Normaltekst, Undertekst} from 'nav-frontend-typografi';
import fridaIcon from '../assets/frida.svg';
import useSession from '../contexts/session';
import useLanguage from '../contexts/language';
import AriaLabelElement from './aria-label';

const openButtonAvatarSizeNumber = 60;
const openButtonAvatarSize = `${openButtonAvatarSizeNumber}px`;

interface ButtonElementProperties {
    isVisible?: boolean;
}

const ButtonElement = styled.button`
    appearance: none;
    background: #fff;
    padding: 6px 13px;
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
        0 0 0 2px rgba(255, 255, 255, 1), 0 1px 4px rgba(0, 0, 0, 0.5),
        0 4px 10px rgba(0, 0, 0, 0.2);

    &:hover {
        background-color: #005b82;
    }

    &:focus {
        background: #005b82;
        outline: none;
        box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.4),
            0 0 0 2px rgba(255, 255, 255, 1), 0 1px 4px rgba(0, 0, 0, 0.6),
            0 4px 10px rgba(0, 0, 0, 0.3), 0 0 0 4px #005b82;
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
    padding-right: ${openButtonAvatarSizeNumber / 2 - 4}px;
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
        box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.3),
            0 0 0 2px rgba(255, 255, 255, 1), 0 1px 4px rgba(0, 0, 0, 0.6),
            0 4px 10px rgba(0, 0, 0, 0.3);
        border-radius: ${openButtonAvatarSize};
    }

    ${ButtonElement}:focus &:before {
        box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.3),
            0 0 0 2px rgba(255, 255, 255, 1), 0 1px 4px rgba(0, 0, 0, 0.6),
            0 4px 10px rgba(0, 0, 0, 0.3), 0 0 0 4px #005b82;
    }

    @media (min-width: 480px) {
        width: ${openButtonAvatarSize};
        height: ${openButtonAvatarSize};
        right: -${openButtonAvatarSizeNumber / 2}px;
    }
`;

const UnreadCountElement = styled(Undertekst)`
    background: #c30000;
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
    }
};

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

    return (
        <ButtonElement
            id='chatbot-frida-knapp' // Required for external onclick
            type='button'
            lang={language}
            isVisible={!isOpen && !isOpening}
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
                {unreadCount > 0 && `${unreadCount > 9 ? '9' : unreadCount}`}
            </UnreadCountElement>

            {unreadCount > 0 && (
                <AriaLabelElement>
                    {unreadCount === 1
                        ? localizations._unread_message
                        : localizations._unread_messages}
                </AriaLabelElement>
            )}
        </ButtonElement>
    );
};

export default OpenButton;
