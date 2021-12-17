import React from 'react';
import styled, {css} from 'styled-components';
import {Normaltekst} from 'nav-frontend-typografi';

const avatarSize = '36px';
const conversationSideWidth = '90%';

const GroupElement = styled.div`
    margin-top: 10px;
`;

const ContainerElement = styled.div`
    width: 100%;
    display: flex;
`;

const AvatarElement = styled.div`
    background-color: #d8d8d8;
    width: ${avatarSize};
    height: ${avatarSize};
    margin-right: 8px;
    border-radius: 30px;
    position: relative;
    top: 1px;
    overflow: hidden;

    &:empty {
        visibility: hidden;
    }

    img {
        width: 100%;
        height: auto;
    }

    &:after {
        content: '';
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
        position: absolute;
        border-radius: 30px;
    }
`;

interface MessageBubbleProperties {
    isHuman?: boolean;
    isThinking?: boolean;
}

const MessageBubble = styled.div`
    max-width: ${conversationSideWidth};
    max-width: calc(${conversationSideWidth} - ${avatarSize} - 8px);
    background: ${(properties: MessageBubbleProperties) =>
        properties.isHuman ? '#eae7e5' : '#e7e9e9'};

    margin: auto;
    padding: 8px 12px;
    position: relative;
    overflow-wrap: break-word;
    box-sizing: border-box;
    display: inline-block;
    vertical-align: top;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08);

    ${(properties: MessageBubbleProperties) =>
        properties.isThinking &&
        css`
            &:before {
                content: '';
                background-color: inherit;
                width: 5px;
                height: 5px;
                border-radius: 5px;
                position: absolute;
                bottom: -2px;
                left: -7px;
                box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08);
            }

            &:after {
                content: '';
                background-color: inherit;
                width: 12px;
                height: 12px;
                border-radius: 12px;
                position: absolute;
                bottom: 0;
                left: -2px;
                border: 1px solid rgba(0, 0, 0, 0.08);
                border-width: 0 0 1px 1px;
            }
        `};
`;

const BubbleLeftElement = styled(MessageBubble)`
    margin-top: 3px;
    margin-left: 0;
    border-radius: 4px 18px 18px 4px;

    ${GroupElement} ${ContainerElement}:first-of-type & {
        margin-top: 0;
        border-radius: 18px 18px 18px 4px;
    }

    ${GroupElement} ${ContainerElement}:last-of-type & {
        border-radius: 4px 18px 18px 18px;
    }

    ${GroupElement} ${ContainerElement}:first-of-type:last-of-type & {
        border-radius: 18px 18px 18px 18px;
    }
`;

const BubbleRightElement = styled(MessageBubble)`
    background-color: #e0f5fb;
    margin-top: 3px;
    margin-right: 0;
    border-radius: 18px 18px 18px 18px;
`;

const TextElement = styled(Normaltekst)`
    white-space: pre-wrap;
`;

interface MessageProperties extends MessageBubbleProperties {
    avatarUrl?: string;
    alignment?: 'left' | 'right';
    lang?: string;
    children?: React.ReactNode;
}

const Message = ({
    avatarUrl,
    alignment,
    lang,
    children,
    ...properties
}: MessageProperties) => {
    const BubbleElement =
        alignment === 'right' ? BubbleRightElement : BubbleLeftElement;

    return (
        <ContainerElement {...properties}>
            <AvatarElement>
                {avatarUrl && <img src={avatarUrl} alt='' />}
            </AvatarElement>

            <BubbleElement {...properties}>
                <TextElement tag='div' {...{lang}}>
                    {children}
                </TextElement>
            </BubbleElement>
        </ContainerElement>
    );
};

export {
    avatarSize,
    conversationSideWidth,
    GroupElement,
    ContainerElement,
    AvatarElement,
    MessageBubble,
    BubbleLeftElement as MessageBubbleLeft,
    BubbleRightElement as MessageBubbleRight
};

export default Message;
