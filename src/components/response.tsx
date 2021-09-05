import React, {useState, useCallback, useEffect, useMemo} from 'react';
import styled, {css} from 'styled-components';
import likeIcon from '../assets/like.svg';
import filledLikeIcon from '../assets/like-filled.svg';
import useSession, {
    BoostConversation,
    BoostResponse
} from '../contexts/session';

import {
    botResponseRevealDelay,
    botResponseRevealDelayBuffer
} from '../configuration';

import Obscured from './obscurer';
import TypingIndicator from './typing-indicator';
import ResponseItem, {ResponseItemProperties} from './response-item';
import Message, {AvatarElement, GroupElement} from './message';
import AriaLabelElement from './aria-label';
import useLanguage from '../contexts/language';

const FeedbackElement = styled.span`
    margin-top: 10px;
    display: flex;
`;

const FeedbackActionsElement = styled.div`
    flex: 1;
`;

type FeedbackButtonElementProperties = {
    isFilled: boolean;
    isOtherFilled: boolean;
};

const FeedbackButtonElement = styled.button`
    appearance: none;
    background: #fff;
    width: 34px;
    height: 34px;
    line-height: 1em;
    border: 0;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.4),
        inset 0 -2px rgba(255, 255, 255, 0.4), inset 0 -1px rgba(0, 0, 0, 0.2);
    margin: 0;
    margin-right: 8px;
    padding: 9px;
    box-sizing: border-box;
    border-radius: 34px;
    cursor: pointer;
    transition: background-color 0.14s, opacity 0.5s, transform 0.3s;

    &:focus {
        outline: none;
        box-shadow: 0 0 0 2px #000, inset 0 0 0 1px #000,
            inset 0 -2px rgba(255, 255, 255, 0.4),
            inset 0 -1px rgba(0, 0, 0, 0.2);
    }

    @media (hover: hover) {
        &:hover {
            transform: scale(1.08) rotate(-5deg);
            opacity: 1;
        }
    }

    ${(properties: FeedbackButtonElementProperties) =>
        properties.isOtherFilled &&
        css`
            opacity: 0.8;
            transform: scale(0.9);
        `};

    svg {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        fill: #000;
        filter: drop-shadow(0 1px 0 rgba(255, 255, 255, 0.5));
        transition: fill 0.14s;
    }
`;

const IconElement = styled.span`
    transition: transform 0.37s;
    display: block;
`;

const LikeButtonElement = styled(FeedbackButtonElement)`
    ${(properties: FeedbackButtonElementProperties) =>
        properties.isFilled &&
        css`
            background-color: #06893a;
        `};

    @media (hover: hover) {
        &:hover {
            ${(properties: FeedbackButtonElementProperties) =>
                !properties.isFilled &&
                css`
                    background-color: #ccf1d6;
                `};
        }
    }

    ${IconElement} {
        transform: translateY(0);

        ${(properties: FeedbackButtonElementProperties) =>
            properties.isFilled &&
            css`
                transform: translateY(-1px);
            `};
    }

    svg {
        ${(properties: FeedbackButtonElementProperties) =>
            properties.isFilled &&
            css`
                fill: #fff;
                filter: drop-shadow(0 1px 0 rgba(0, 0, 0, 0.4))
                    drop-shadow(0 0 1px rgba(0, 0, 0, 0.4));
            `};
    }
`;

const LikeButton = ({
    isFilled,
    children,
    ...properties
}: React.ComponentPropsWithRef<typeof LikeButtonElement> & {
    isFilled: boolean;
}) => (
    <LikeButtonElement {...properties} {...{isFilled}}>
        {children}
        <IconElement
            dangerouslySetInnerHTML={{
                __html: isFilled ? filledLikeIcon : likeIcon
            }}
        />
    </LikeButtonElement>
);

const DislikeButtonElement = styled(FeedbackButtonElement)`
    ${(properties: FeedbackButtonElementProperties) =>
        properties.isFilled &&
        css`
            background-color: #ba3a26;
        `};

    @media (hover: hover) {
        &:hover {
            ${(properties: FeedbackButtonElementProperties) =>
                !properties.isFilled &&
                css`
                    background-color: #f9d2cc;
                `};
        }
    }

    ${IconElement} {
        transform: translateY(1px);

        ${(properties: FeedbackButtonElementProperties) =>
            properties.isFilled &&
            css`
                transform: translateY(0);
            `};
    }

    svg {
        transform: rotate(180deg);
        filter: drop-shadow(0 -1px 0 rgba(255, 255, 255, 0.3));

        ${(properties: FeedbackButtonElementProperties) =>
            properties.isFilled &&
            css`
                fill: #fff;
                filter: drop-shadow(0 -1px 0 rgba(0, 0, 0, 0.4))
                    drop-shadow(0 0 1px rgba(0, 0, 0, 0.4));
            `};
    }
`;

const DislikeButton = ({
    isFilled,
    children,
    ...properties
}: React.ComponentPropsWithRef<typeof LikeButtonElement> & {
    isFilled: boolean;
}) => (
    <DislikeButtonElement {...properties} {...{isFilled}}>
        {children}
        <IconElement
            dangerouslySetInnerHTML={{
                __html: isFilled ? filledLikeIcon : likeIcon
            }}
        />
    </DislikeButtonElement>
);

const BotTypingIndicator = (properties: {response?: BoostResponse}) => (
    <Message isThinking avatarUrl={properties.response?.avatar_url}>
        <TypingIndicator />
    </Message>
);

const translations = {
    give_answer_thumbs_up: {
        en: 'Give this answer a thumbs up',
        no: 'Gi tommel opp til dette svaret'
    },
    remove_thumbs_up_from_answer: {
        en: 'Remove thumbs up from this answer',
        no: 'Fjern tommel opp fra dette svaret'
    },
    give_answer_thumbs_down: {
        en: 'Give this answer a thumbs down',
        no: 'Gi tommel ned til dette svaret'
    },
    remove_thumbs_down_from_answer: {
        en: 'Remove thumbs down from this answer',
        no: 'Fjern tommel ned fra dette svaret'
    }
};

interface ResponseProperties extends Omit<ResponseItemProperties, 'element'> {
    conversation?: BoostConversation;
    onReveal?: () => void;
}

const Response = ({
    conversation,
    response,
    responseIndex,
    responsesLength,
    isObscured,
    onReveal,
    ...properties
}: ResponseProperties) => {
    const {translate} = useLanguage();
    const localizations = useMemo(() => translate(translations), [translate]);
    const {sendMessageFeedback} = useSession();
    const [feedbackState, setFeedbackState] = useState<
        BoostResponse['feedback']
    >(response.feedback);
    const isHuman = conversation?.state.chat_status === 'assigned_to_human';
    const isBotMessage = response.source === 'bot' && !response.is_human_agent;
    const responseDate = new Date(response.date_created);
    const responseTimestamp = responseDate.getTime();
    let typingRevealTimestamp = 0;
    let revealTimestamp = 0;

    const shouldObscure =
        !isHuman &&
        response.source === 'bot' &&
        responseIndex === (responsesLength ?? 1) - 1;

    if (shouldObscure) {
        typingRevealTimestamp =
            responseIndex === 0
                ? responseTimestamp
                : responseTimestamp + botResponseRevealDelay;
        revealTimestamp =
            typingRevealTimestamp +
            botResponseRevealDelayBuffer +
            botResponseRevealDelayBuffer * Math.random();
    }

    const toggleLike = useCallback(() => {
        if (sendMessageFeedback) {
            const action =
                feedbackState === 'positive' ? 'remove-positive' : 'positive';
            void sendMessageFeedback(response.id, action);
            setFeedbackState(action);
        }
    }, [sendMessageFeedback, response.id, feedbackState]);

    const toggleDislike = useCallback(() => {
        if (sendMessageFeedback) {
            const action =
                feedbackState === 'negative' ? 'remove-negative' : 'negative';
            void sendMessageFeedback(response.id, action);
            setFeedbackState(action);
        }
    }, [sendMessageFeedback, response.id, feedbackState]);

    const handleReveal = useCallback(() => {
        if (onReveal) {
            onReveal();
        }
    }, [onReveal]);

    useEffect(() => {
        setFeedbackState(response.feedback);
    }, [response.feedback]);

    if (!response?.elements) {
        return null;
    }

    const responseElementsLength = response.elements?.length;

    if (responseElementsLength === 0) {
        return null;
    }

    return (
        <GroupElement role='document'>
            <Obscured
                untilTimestamp={revealTimestamp}
                by={<BotTypingIndicator {...{response}} />}
                onReveal={handleReveal}
            >
                {response.elements.map((element, index) => {
                    const isFinalResponseElement =
                        responseElementsLength === index + 1;
                    let elementTypingRevealTimestamp = 0;
                    let elementRevealTimestamp = 0;

                    if (shouldObscure && index !== 0) {
                        elementTypingRevealTimestamp =
                            revealTimestamp + botResponseRevealDelay * index;

                        elementRevealTimestamp =
                            element.type === 'links'
                                ? 0
                                : elementTypingRevealTimestamp +
                                  botResponseRevealDelayBuffer +
                                  botResponseRevealDelayBuffer * Math.random();
                    }

                    return (
                        <Obscured
                            // eslint-disable-next-line react/no-array-index-key
                            key={index}
                            untilTimestamp={elementTypingRevealTimestamp}
                        >
                            <Obscured
                                untilTimestamp={elementRevealTimestamp}
                                by={<BotTypingIndicator />}
                                onReveal={handleReveal}
                            >
                                <ResponseItem
                                    {...properties}
                                    {...{
                                        conversation,
                                        response,
                                        responseIndex,
                                        responsesLength,
                                        element,
                                        isObscured
                                    }}
                                    elementIndex={index}
                                />

                                {isFinalResponseElement && isBotMessage && (
                                    <FeedbackElement>
                                        <AvatarElement />
                                        <FeedbackActionsElement>
                                            <LikeButton
                                                type='button'
                                                tabIndex={isObscured ? -1 : 0}
                                                disabled={isObscured}
                                                isFilled={
                                                    feedbackState === 'positive'
                                                }
                                                isOtherFilled={
                                                    feedbackState === 'negative'
                                                }
                                                onClick={toggleLike}
                                            >
                                                <AriaLabelElement>
                                                    {feedbackState ===
                                                    'positive'
                                                        ? localizations.remove_thumbs_up_from_answer
                                                        : localizations.give_answer_thumbs_up}
                                                </AriaLabelElement>
                                            </LikeButton>

                                            <DislikeButton
                                                type='button'
                                                tabIndex={isObscured ? -1 : 0}
                                                disabled={isObscured}
                                                isFilled={
                                                    feedbackState === 'negative'
                                                }
                                                isOtherFilled={
                                                    feedbackState === 'positive'
                                                }
                                                onClick={toggleDislike}
                                            >
                                                <AriaLabelElement>
                                                    {feedbackState ===
                                                    'negative'
                                                        ? localizations.remove_thumbs_down_from_answer
                                                        : localizations.give_answer_thumbs_down}
                                                </AriaLabelElement>
                                            </DislikeButton>
                                        </FeedbackActionsElement>
                                    </FeedbackElement>
                                )}
                            </Obscured>
                        </Obscured>
                    );
                })}
            </Obscured>
        </GroupElement>
    );
};

export {ResponseProperties};
export default Response;
