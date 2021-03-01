import React, {useState, useMemo, useEffect, useCallback} from 'react';
import styled from 'styled-components';
import {RadioPanel} from 'nav-frontend-skjema';
import useLanguage from '../contexts/language';
import useLoader from '../hooks/use-loader';

import {
    BoostResponse,
    BoostResponseElementLinksItem
} from '../contexts/session';

import {linkDisableTimeout, englishButtonText} from '../configuration';
import Spinner, {SpinnerElement} from './spinner';

import Message, {
    avatarSize,
    conversationSideWidth,
    ContainerElement,
    AvatarElement
} from './message';
import AriaLabelElement from './aria-label';

const LinkButtonElement = styled.div`
    max-width: ${conversationSideWidth};
    max-width: calc(${conversationSideWidth} - ${avatarSize} - 8px);
    margin-top: 3px;
    position: relative;

    .inputPanel__label::before {
        box-sizing: border-box;
    }

    ${SpinnerElement} {
        width: 10px;
        height: 10px;
        position: absolute;
        top: 1.45rem;
        left: 1.45rem;

        svg circle {
            stroke: rgba(255, 255, 255, 0.1);
        }

        svg circle:last-child {
            stroke: rgba(255, 255, 255, 1);
        }
    }
`;

const translations = {
    _opens_in_new_window: {
        en: '(opens in new window)',
        no: '(åpnes i nytt vindu)'
    }
};

interface ResponseLinkProperties {
    response: BoostResponse;
    elementIndex?: number;
    link: BoostResponseElementLinksItem;
    tabIndex?: number;
    onAction?: (link: BoostResponseElementLinksItem) => Promise<void>;
    onLink?: (link: BoostResponseElementLinksItem) => Promise<void>;
}

const ResponseLink = ({
    response,
    elementIndex,
    link,
    tabIndex,
    onAction,
    onLink
}: ResponseLinkProperties) => {
    const {translate} = useLanguage();
    const localizations = useMemo(() => translate(translations), [translate]);
    const [isSelected, setIsSelected] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [isLoading, setIsLoading] = useLoader();

    const handleAction = useCallback(async () => {
        if (!isLoading && onAction) {
            const finishLoading = setIsLoading();
            await onAction(link);
            finishLoading();

            setIsSelected(true);
            setIsDisabled(true);
        }
    }, [link, isLoading, setIsLoading, onAction]);

    const handleKeyPress = useCallback(
        (event) => {
            if (event.key.toLowerCase() === 'enter') {
                void handleAction();
            }
        },
        [handleAction]
    );

    const handleLinkClick = useCallback(
        async (event) => {
            if (onLink) {
                event.preventDefault();
                event.stopPropagation();

                if (!isLoading) {
                    const finishLoading = setIsLoading();
                    await onLink(link);
                    finishLoading();
                }
            }
        },
        [link, isLoading, setIsLoading, onLink]
    );

    useEffect(() => {
        if (isDisabled) {
            const timeout = setTimeout(() => {
                setIsDisabled(false);
            }, linkDisableTimeout);

            return () => {
                clearTimeout(timeout);
            };
        }

        return undefined;
    }, [isDisabled]);

    const [responseLanguage] = (response.language ?? 'no').split('-');

    if (link.url && link.type === 'external_link') {
        return (
            <Message
                avatarUrl={elementIndex === 0 ? response.avatar_url : undefined}
                lang={responseLanguage}
            >
                <a
                    href={link.url}
                    target={link.link_target}
                    {...{tabIndex}}
                    data-internal
                    onClick={handleLinkClick}
                >
                    {link.text}
                    {link.link_target === '_blank' && (
                        <>
                            {' '}
                            <AriaLabelElement>
                                {localizations._opens_in_new_window}
                            </AriaLabelElement>
                        </>
                    )}
                </a>
            </Message>
        );
    }

    return (
        <ContainerElement
            lang={link.text === englishButtonText ? 'en' : responseLanguage}
            onKeyPress={handleKeyPress}
        >
            <AvatarElement />
            <LinkButtonElement>
                <RadioPanel
                    label={
                        <>
                            {isLoading && <Spinner />}
                            {link.text}
                        </>
                    }
                    checked={isSelected || isLoading}
                    disabled={tabIndex === -1}
                    onChange={handleAction}
                />
            </LinkButtonElement>
        </ContainerElement>
    );
};

export {ResponseLinkProperties};
export default ResponseLink;
