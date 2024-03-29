import React, {useRef, useState, useMemo, useEffect, useCallback} from 'react';
import styled, {css} from 'styled-components';
import cookies from 'js-cookie';
import useLanguage, {LanguageProvider} from './contexts/language';
import '@navikt/ds-css';

import useSession, {
    SessionProperties,
    SessionProvider,
    BoostResponseElementLinksItem
} from './contexts/session';

import Header from './components/header';
import TypingIndicator from './components/typing-indicator';
import OpenButton from './components/open-button';
import StatusStrip from './components/status-strip';
import Message, {GroupElement} from './components/message';
import Form from './components/form';
import Response from './components/response';
import ConsentModal from './components/consent-modal';
import FinishModal from './components/finish-modal';
import EvaluationModal from './components/evaluation-modal';
import AriaLabelElement from './components/aria-label';

import {
    englishButtonText,
    englishButtonResponse,
    containerWidth,
    containerHeight,
    fullscreenMediaQuery,
    navigationMinimizationMediaQuery,
    cookieDomain,
    openCookieName,
    consentCookieName,
    unreadCookieName,
    contextFilters,
    employerButtonText,
    personButtonText
} from './configuration';

interface ContainerElement {
    isFullscreen?: boolean;
    isClosing?: boolean;
    isOpening?: boolean;
}

const ContainerElement = styled.div`
    background-color: #fff;
    color: #000;
    width: ${containerWidth};
    height: ${containerHeight};
    height: min(${containerHeight}, calc(100% - 20px - 20px));
    box-sizing: border-box;
    display: flex;
    flex-flow: column;
    position: fixed;
    right: 0;
    bottom: 0;
    z-index: 999;
    z-index: 999999;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3), 0 5px 10px rgba(0, 0, 0, 0.1),
        0 5px 5px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    border-radius: 2px;
    transform: translate3d(-20px, -20px, 0);
    transition: width 0.37s, height 0.37s, transform 0.37s;
    transform-origin: 100% 100%;
    touch-action: manipulation;

    ${(properties: ContainerElement) =>
        properties.isFullscreen
            ? css`
                  width: 100%;
                  height: 100%;
                  transform: translate3d(0, 0, 0);
              `
            : css`
                  @media ${fullscreenMediaQuery} {
                      width: 100%;
                      height: 100%;
                      transform: translate3d(0, 0, 0);
                  }
              `};

    ${(properties: ContainerElement) =>
        (properties.isClosing || properties.isOpening) &&
        css`
            @media screen {
                height: 200px;

                ${properties.isFullscreen
                    ? 'transform: translate3d(0, 220px, 0);'
                    : 'transform: translate3d(-20px, 220px, 0);'}
            }

            @media ${fullscreenMediaQuery} {
                transform: translate3d(0, 220px, 0);
            }
        `};

    a {
        color: #0067c5;
        text-decoration: underline;
    }

    @media (hover: hover) {
        a:hover {
            color: #0074df;
            text-decoration: none;
        }
    }
`;

const PaddingElement = styled.div`
    padding: 14px 12px;
    box-sizing: border-box;
`;

const StatusElement = styled.div`
    &:empty {
        display: none;
    }
`;

const StatusContainerElement = styled.div`
    position: sticky;
    bottom: 10px;
    margin-top: 15px;

    &:first-child {
        margin-top: 0;
    }
`;

const ConversationElement = styled.div`
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    flex: 1;
    position: relative;
`;

const FillerElement = styled.div`
    height: 100%;
    min-height: ${containerHeight};
`;

const AnchorElement = styled.div`
    overflow-anchor: auto;
`;

const translations = {
    nav_is_typing: {
        en: 'NAV is typing...',
        no: 'NAV skriver...'
    }
};

function setWindowOpenCookie(isOpen = true) {
    return cookies.set(openCookieName, String(isOpen), {
        domain: cookieDomain,
        expires: 0.5
    });
}

function setConsentCookie(isConsented = true) {
    return cookies.set(consentCookieName, String(isConsented), {
        domain: cookieDomain,
        expires: 7
    });
}

function setUnreadCookie(unreadCount = 0) {
    return cookies.set(unreadCookieName, String(unreadCount), {
        domain: cookieDomain,
        expires: 0.5
    });
}

function shouldMinimizeOnNavigation() {
    return window.matchMedia(navigationMinimizationMediaQuery).matches;
}

interface ChatProperties {
    analyticsCallback?: () => void;
}

type AnalyticsType = undefined | ((name: string, data: any) => void);

const Chat = ({analyticsCallback}: ChatProperties) => {
    const {translate, language} = useLanguage();
    const {
        status,
        conversation,
        responses,
        queue,
        actionFilters,
        start,
        restart,
        finish,
        sendMessage,
        sendAction,
        sendLink,
        changeContext
    } = useSession();

    const localizations = useMemo(() => translate(translations), [translate]);
    const responsesLength = responses?.length;
    const [reference, setReference] = useState<HTMLDivElement>();
    const anchor = useRef<HTMLDivElement>();
    const [isOpen, setIsOpen] = useState<boolean>(
        () => cookies.get(openCookieName) === 'true'
    );

    const [isClosing, setIsClosing] = useState<boolean>(false);
    const [isOpening, setIsOpening] = useState<boolean>(false);
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
    const [isAgentTyping, setIsAgentTyping] = useState<boolean>(false);
    const [isFinishing, setIsFinishing] = useState<boolean>(false);
    const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

    const [isConsented, setIsConsented] = useState<boolean>(
        () => cookies.get(consentCookieName) === 'true'
    );

    const [readCount, setReadCount] = useState<number>(0);
    const [unreadCount, setUnreadCount] = useState<number>(
        () => Number.parseInt(String(cookies.get(unreadCookieName)), 10) || 0
    );

    const basicAnalytics: AnalyticsType = analyticsCallback;

    const scrollToBottom = useCallback((options?: ScrollIntoViewOptions) => {
        if (anchor.current) {
            anchor.current.scrollIntoView({
                block: 'start',
                behavior: 'smooth',
                ...options
            });
        }
    }, []);

    const handleMount = useCallback((node: HTMLDivElement) => {
        if (node) {
            setReference(node);
        }
    }, []);

    const handleAction = useCallback(
        async (link: BoostResponseElementLinksItem) => {
            if (basicAnalytics) {
                basicAnalytics('sender-melding', {
                    komponent: 'chatbot',
                    type:
                        conversation?.state.chat_status === 'assigned_to_human'
                            ? 'veileder'
                            : 'frida'
                });
            }
            if (link?.text === englishButtonText) {
                void sendMessage!(englishButtonResponse);
            } else {
                const sentActionFilters =
                    actionFilters?.filter(
                        (filter) => !contextFilters.includes(filter)
                    ) || [];

                if (link?.text === employerButtonText) {
                    changeContext!('arbeidsgiver');
                    sentActionFilters.push('arbeidsgiver');
                } else if (link?.text === personButtonText) {
                    changeContext!('privatperson');
                    sentActionFilters.push('privatperson');
                }
                void sendAction!(link.id, {actionFilters: sentActionFilters});
            }

            scrollToBottom();
        },
        [actionFilters, sendMessage, changeContext, sendAction, scrollToBottom]
    );

    const handleSubmit = useCallback(
        (message: string) => {
            if (basicAnalytics) {
                basicAnalytics('sender-melding', {
                    komponent: 'chatbot',
                    type:
                        conversation?.state.chat_status === 'assigned_to_human'
                            ? 'veileder'
                            : 'frida'
                });
            }
            void sendMessage!(message);
        },
        [sendMessage]
    );

    const handleOpen = useCallback(async () => {
        setIsOpening(true);
        setIsOpen(true);
        setUnreadCount(0);
        scrollToBottom({behavior: 'auto'});

        if (basicAnalytics) {
            basicAnalytics('chat-åpen', {komponent: 'chatbot'});
        }

        if (reference) {
            reference.focus();
        }
    }, [reference, scrollToBottom]);

    const handleConsent = useCallback(async () => {
        setIsConsented(true);
        scrollToBottom({behavior: 'auto'});
    }, [scrollToBottom]);

    function toggleFullscreen() {
        setIsFullscreen((previousState) => !previousState);
    }

    const handleClose = useCallback(async () => {
        setIsClosing(true);

        await new Promise((resolve) => {
            window.setTimeout(resolve, 370);
        });

        setIsOpen(false);
        setIsFullscreen(false);
        setUnreadCount(0);
        // if (basicAnalytics) {
        //     basicAnalytics('chat-lukket', {komponent: 'chatbot'});
        // }
    }, [setIsClosing]);

    const handleConditionalFullscreenClose = useCallback(async () => {
        if (isFullscreen) {
            await handleClose();
        } else {
            try {
                if (shouldMinimizeOnNavigation()) {
                    await handleClose();
                }
            } catch {
                await handleClose();
            }
        }
    }, [isFullscreen, handleClose]);

    const handleLink = useCallback(
        async (link: BoostResponseElementLinksItem) => {
            if (link.url) {
                if (link.link_target === '_blank') {
                    try {
                        if (shouldMinimizeOnNavigation()) {
                            setWindowOpenCookie(false);
                        }
                    } catch {
                        setWindowOpenCookie(false);
                    }

                    void sendLink!(link.id);
                    window.open(link.url, link.link_target);
                } else {
                    await Promise.all([
                        sendLink!(link.id),
                        handleConditionalFullscreenClose()
                    ]);

                    window.location.href = link.url;
                }
            }
        },
        [sendLink, handleConditionalFullscreenClose]
    );

    const handleRestart = useCallback(() => {
        void restart!();
        setUnreadCount(0);
    }, [restart]);

    const handleFinish = useCallback(async () => {
        if (!isConsented) {
            void finish!();
            return handleClose();
        }

        let shouldFinish = false;

        if ((responsesLength || 0) < 2) {
            shouldFinish = true;
        } else if (isEvaluating) {
            shouldFinish = true;
        }

        if (shouldFinish) {
            await handleClose();
            void finish!();
            setIsFinishing(false);
            setIsEvaluating(false);

            if (basicAnalytics) {
                basicAnalytics('chat-avsluttet', {komponent: 'chatbot'});
            }
        } else if (isFinishing) {
            setIsEvaluating(true);
        } else {
            setIsFinishing(true);
        }
    }, [
        responsesLength,
        isConsented,
        isFinishing,
        isEvaluating,
        finish,
        handleClose
    ]);

    function handleCancelFinish() {
        setIsFinishing(false);
    }

    useEffect(() => {
        if (reference) {
            const listener = async (event: MouseEvent) => {
                const target = event.target as HTMLElement;

                if (target && !target.getAttribute('target')) {
                    let href;

                    try {
                        const link = target.closest('a');

                        if (
                            link &&
                            link?.getAttribute('data-internal') !== 'true'
                        ) {
                            href = link.getAttribute('href');
                        }
                    } catch {
                        if (
                            target.tagName.toLowerCase() === 'a' &&
                            target.getAttribute('data-internal') !== 'true'
                        ) {
                            href = target.getAttribute('href');
                        }
                    }

                    if (href) {
                        event.preventDefault();
                        event.stopPropagation();

                        await (target.getAttribute('data-minimize') === 'true'
                            ? handleClose()
                            : handleConditionalFullscreenClose());

                        window.location.href = href;
                    }
                }
            };

            reference.addEventListener('click', listener);

            return () => {
                reference.removeEventListener('click', listener);
            };
        }

        return undefined;
    }, [reference, handleClose, handleConditionalFullscreenClose]);

    useEffect(() => {
        if (isOpen && (status === 'disconnected' || status === 'ended')) {
            setUnreadCount(0);
        }
    }, [start, isOpen, status]);

    useEffect(() => {
        if (isOpen && isOpening) {
            setIsOpening(false);
        } else if (!isOpen && isClosing) {
            setIsClosing(false);
        }
    }, [isOpen, isOpening, isClosing]);

    useEffect(() => {
        setWindowOpenCookie(isOpen);
    }, [isOpen]);

    useEffect(() => {
        if (isConsented) {
            setConsentCookie(isConsented);
        }
    }, [isConsented]);

    useEffect(() => {
        if (responsesLength && isOpen) {
            setReadCount(responsesLength);
        }
    }, [isOpen, responsesLength]);

    useEffect(() => {
        if (responsesLength && readCount > 0) {
            setUnreadCount(responsesLength - readCount);
        }
    }, [responsesLength, readCount]);

    useEffect(() => {
        scrollToBottom();
    }, [status, queue, scrollToBottom]);

    useEffect(() => {
        setUnreadCookie(unreadCount);
    }, [unreadCount]);

    useEffect(() => {
        const isHumanTyping = Boolean(conversation?.state.human_is_typing);

        if (isHumanTyping) {
            setIsAgentTyping(isHumanTyping);
        } else {
            const timeout = window.setTimeout(() => {
                setIsAgentTyping(isHumanTyping);
            }, 1000);

            return () => {
                clearTimeout(timeout);
            };
        }

        return undefined;
    }, [conversation?.state.human_is_typing]);

    useEffect(() => {
        setIsAgentTyping(false);
    }, [responses]);

    useEffect(() => {
        if (
            isOpen &&
            isConsented &&
            (status === 'disconnected' || status === 'ended')
        ) {
            void start!();
        }
    }, [isOpen, isConsented, status, start]);

    const isConsideredOpen = isOpen || isOpening;
    const isModalOpen = !isConsented || isFinishing || isEvaluating;

    return (
        <div ref={handleMount} id='nav-chatbot'>
            <OpenButton
                {...{isOpen, isOpening, unreadCount}}
                onClick={handleOpen}
            />

            {isConsideredOpen && (
                <ContainerElement
                    lang={language}
                    {...{isFullscreen, isClosing, isOpening}}
                >
                    <Header
                        {...{isFullscreen}}
                        isObscured={isModalOpen}
                        onClose={handleClose}
                        onToggleFullscreen={toggleFullscreen}
                        onFinish={handleFinish}
                    />

                    <ConversationElement aria-hidden={isModalOpen}>
                        <PaddingElement>
                            {(!responses || responses?.length === 0) && (
                                <FillerElement />
                            )}

                            <div role='log'>
                                {responses?.map((response, index) => (
                                    <div
                                        key={response.id}
                                        aria-live='assertive'
                                    >
                                        <Response
                                            isObscured={isModalOpen}
                                            {...{
                                                conversation,
                                                response,
                                                responses
                                            }}
                                            responseIndex={index}
                                            responsesLength={responsesLength}
                                            onAction={handleAction}
                                            onLink={handleLink}
                                            onReveal={scrollToBottom}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div aria-live='assertive' role='alert'>
                                {isAgentTyping && (
                                    <GroupElement>
                                        <AriaLabelElement>
                                            {localizations.nav_is_typing}
                                        </AriaLabelElement>

                                        <Message isThinking>
                                            <TypingIndicator />
                                        </Message>
                                    </GroupElement>
                                )}
                            </div>

                            {queue && <Response response={queue} />}

                            <StatusContainerElement
                                aria-live='assertive'
                                role='alert'
                            >
                                <StatusElement>
                                    <StatusStrip />
                                </StatusElement>
                            </StatusContainerElement>

                            <AnchorElement ref={anchor as any} />
                        </PaddingElement>
                    </ConversationElement>

                    <Form
                        isObscured={isModalOpen}
                        onSubmit={handleSubmit}
                        onRestart={handleRestart}
                    />

                    <ConsentModal
                        isOpen={!isConsented}
                        onCancel={handleConsent}
                        onConfirm={handleFinish}
                    />

                    <FinishModal
                        isOpen={isFinishing && !isEvaluating}
                        onConfirm={handleFinish}
                        onCancel={handleCancelFinish}
                    />

                    <EvaluationModal
                        isOpen={isEvaluating}
                        onFeedback={analyticsCallback}
                        onConfirm={handleFinish}
                    />
                </ContainerElement>
            )}
        </div>
    );
};

interface ChatbotProperties extends SessionProperties, ChatProperties {}

const Chatbot = ({
    boostApiUrlBase,
    actionFilters,
    ...properties
}: ChatbotProperties) => (
    <LanguageProvider>
        <SessionProvider {...{boostApiUrlBase, actionFilters}}>
            <Chat {...properties} />
        </SessionProvider>
    </LanguageProvider>
);

export {ChatbotProperties};
export default Chatbot;
