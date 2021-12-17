import React, {useMemo} from 'react';
import styled from 'styled-components';
import {LenkepanelBase} from 'nav-frontend-lenkepanel';
import {Ingress, Normaltekst, Undertekst} from 'nav-frontend-typografi';
import {Select} from 'nav-frontend-skjema';
import idPortenIcon from '../assets/id-porten.svg';
import useLanguage from '../contexts/language';
import {BoostResponse, BoostResponseElement} from '../contexts/session';
import {authenticationMessagePrefix} from '../configuration';
import Spinner from './spinner';
import Message, {GroupElement, MessageBubble} from './message';
import ResponseLink, {ResponseLinkProperties} from './response-link';
import AriaLabelElement from './aria-label';

const ContentsElement = styled.span`
    p {
        margin: 0;
        padding: 0;
    }

    ul,
    ol {
        white-space: normal;
        margin: 0;
        padding: 0;
        padding-left: 20px;
    }

    ul {
        list-style: disc;
    }

    ol {
        list-style: decimal;
    }

    li {
        margin: 0;
        padding: 0;

        & p {
            white-space: pre-wrap;
        }
    }
`;

const SubtextElement = styled(Undertekst)`
    text-align: right;
    color: #444;
`;

const SpinnerElement = styled.span`
    position: relative;
    margin-left: 4px;
    top: 4px;
`;

const LinkPanelElement = styled(LenkepanelBase)`
    margin-top: 15px;
    margin-bottom: 15px;

    && {
        text-decoration: none;
    }

    ${GroupElement}:nth-last-child(3) & {
        margin-bottom: 0;
    }
`;

const LinkPanelIconElement = styled.div`
    background: #d0d2cf;
    width: 36px;
    height: 36px;
    margin-left: 5px;
    fill: #2d3033;
    border-radius: 2px;
`;

const LinkPanelTextElement = styled.div`
    margin-left: 20px;
    flex: 1;
`;

const LinkPanelTextTitle = styled(Ingress)`
    color: #3e3832;

    @media (hover: hover) {
        ${LinkPanelElement}:hover & {
            color: #0067c5;
            text-decoration: underline;
        }
    }
`;

const LinkPanelTextBody = styled(Normaltekst)`
    color: #3e3832;
`;

const VideoMessageElement = styled(Message)`
    max-width: 500px;
    flex: 1;

    ${MessageBubble} {
        width: 100%;
        box-sizing: border-box;
    }
`;

const VideoElement = styled.div`
    width: 100%;
    max-width: 400px;
    margin-top: 3px;
    margin-bottom: 3px;
    border-radius: 6px;
    position: relative;
    padding-bottom: 56.25%;
    overflow: hidden;
`;

const IframeElement = styled.iframe`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
`;

const translations = {
    you_say: {
        en: 'You say',
        no: 'Du sier'
    },
    chatbot_frida_says: {
        en: 'Chat robot Frida says',
        no: 'Chat-robot Frida sier'
    },
    nav_says: {
        en: 'NAV says',
        no: 'NAV sier'
    },
    sending: {
        en: 'Sending...',
        no: 'Sender...'
    },
    sent: {
        en: 'Sent',
        no: 'Sendt'
    },
    electronic_authentication: {
        en: 'Electronic authentication',
        no: 'Elektronisk autentisering'
    },
    please_log_in: {
        en: 'For us to help you, please log in.',
        no: 'Vennligst logg inn så vi kan hjelpe deg.'
    }
};

interface ContentsProperties {
    html: string;
    lang?: string;
}

const Contents = ({html, lang}: ContentsProperties) => {
    const output = useMemo(() => {
        let result = html;

        if (lang) {
            const paragraphRegexp = /<p>/gm;
            const paragraphMatches = result.match(paragraphRegexp);

            if (paragraphMatches) {
                result = result.replace(paragraphRegexp, `<p lang="${lang}">`);
            }
        }

        const linkRegexp = /(^|\s)((?:www\.|https?:\/\/)\S+)($|\s)/gm;
        const linkMatches = result.match(linkRegexp);

        if (linkMatches) {
            result = result.replace(
                linkRegexp,
                (string, prefix, match, suffix) => {
                    if (match) {
                        let url = String(match);

                        if (url.startsWith('www.')) {
                            url = `http://${url}`;
                        }

                        const href = `<a href="${url}">${url}</a>`;

                        return `${String(prefix)}${href}${String(suffix)}`;
                    }

                    return string;
                }
            );
        }

        return result;
    }, [html, lang]);

    return (
        <ContentsElement
            role='text'
            {...{lang}}
            dangerouslySetInnerHTML={{__html: output}}
        />
    );
};

interface ResponseItemProperties extends Omit<ResponseLinkProperties, 'link'> {
    isObscured?: boolean;
    responseIndex?: number;
    element: BoostResponseElement;
    responses?: BoostResponse[];
    responsesLength?: number;
}

const ResponseItem = ({
    isObscured,
    response,
    responseIndex,
    element,
    elementIndex,
    responses,
    responsesLength,
    ...properties
}: ResponseItemProperties) => {
    const {translate, language} = useLanguage();
    const localizations = useMemo(() => translate(translations), [translate]);
    const mostRecentClientMessageIndex = useMemo(
        () =>
            (responsesLength ?? 0) -
            (responses
                ?.slice()
                .reverse()
                .findIndex((response) => response.source === 'client') ?? 0) -
            1,
        [responses, responsesLength]
    );

    const [responseLanguage] = (response.language ?? 'no').split('-');
    const isHumanAgent = Boolean(response.is_human_agent);

    if (element.type === 'text') {
        const {text} = element.payload;

        if (response.source === 'local') {
            return (
                <div style={{opacity: 0.7}}>
                    <AriaLabelElement lang={language}>
                        {`${localizations.you_say}:`}
                    </AriaLabelElement>

                    <Message alignment='right' lang={responseLanguage}>
                        {text}
                    </Message>

                    <SubtextElement lang={language}>
                        {localizations.sending}

                        <SpinnerElement>
                            <Spinner />
                        </SpinnerElement>
                    </SubtextElement>
                </div>
            );
        }

        if (response.source === 'client') {
            const displaySentIndicator = Boolean(
                mostRecentClientMessageIndex === undefined ||
                    responseIndex === mostRecentClientMessageIndex
            );

            return (
                <>
                    <AriaLabelElement lang={language}>
                        {`${localizations.you_say}:`}
                    </AriaLabelElement>

                    <Message alignment='right' lang={responseLanguage}>
                        {text}
                    </Message>

                    {displaySentIndicator && (
                        <SubtextElement lang={language}>
                            {localizations.sent}
                        </SubtextElement>
                    )}
                </>
            );
        }

        return (
            <>
                <AriaLabelElement lang={language}>
                    {`${
                        isHumanAgent
                            ? localizations.nav_says
                            : localizations.chatbot_frida_says
                    }:`}
                </AriaLabelElement>

                <Message
                    isHuman={isHumanAgent}
                    avatarUrl={
                        elementIndex === 0 ? response.avatar_url : undefined
                    }
                    lang={responseLanguage}
                >
                    {text}
                </Message>
            </>
        );
    }

    if (element.type === 'html') {
        const html = String(element.payload.html);

        if (html.startsWith(authenticationMessagePrefix)) {
            const [, authenticationUrl] = html.split(
                authenticationMessagePrefix
            );

            return (
                <LinkPanelElement
                    border
                    href={authenticationUrl}
                    linkCreator={(properties) => (
                        <a
                            {...properties}
                            data-internal
                            target='_blank'
                            tabIndex={isObscured ? -1 : 0}
                        />
                    )}
                >
                    <LinkPanelIconElement
                        dangerouslySetInnerHTML={{
                            __html: idPortenIcon
                        }}
                    />

                    <LinkPanelTextElement>
                        <LinkPanelTextTitle lang={responseLanguage}>
                            {localizations.electronic_authentication}
                        </LinkPanelTextTitle>
                        <LinkPanelTextBody lang={responseLanguage}>
                            {localizations.please_log_in}
                        </LinkPanelTextBody>
                    </LinkPanelTextElement>
                </LinkPanelElement>
            );
        }

        const responseItem = (
            <>
                <AriaLabelElement lang={language}>
                    {`${
                        isHumanAgent
                            ? localizations.nav_says
                            : localizations.chatbot_frida_says
                    }:`}
                </AriaLabelElement>

                <Message
                    isHuman={isHumanAgent}
                    avatarUrl={
                        elementIndex === 0 ? response.avatar_url : undefined
                    }
                    lang={responseLanguage}
                >
                    <Contents {...{html}} lang={responseLanguage} />
                </Message>
            </>
        );

        return responseItem;
    }

    if (element.type === 'video') {
        let videoUrl = element.payload.url;

        if (videoUrl.startsWith('https://vimeo.com/')) {
            videoUrl = videoUrl.replace(
                'https://vimeo.com/',
                'https://player.vimeo.com/video/'
            );
        } else if (videoUrl.startsWith('https://youtu.be/')) {
            videoUrl = videoUrl.replace(
                'https://youtu.be/',
                'https://www.youtube.com/embed/'
            );
        } else if (videoUrl.startsWith('https://www.youtube.com/watch?')) {
            const [, videoUrlQueries] = videoUrl.split('?');
            let videoId = '';

            for (const query of videoUrlQueries.split('&')) {
                const [key, value] = query.split('=');

                if (key === 'v' && value) {
                    videoId = value;
                }
            }

            if (videoId) {
                videoUrl = `https://www.youtube.com/embed/${videoId}`;
            }
        }

        return (
            <VideoMessageElement isHuman={isHumanAgent}>
                <VideoElement>
                    <IframeElement
                        allowFullScreen
                        src={videoUrl}
                        width='100%'
                        height='100%'
                        frameBorder='0'
                        allow='autoplay; fullscreen; picture-in-picture'
                    />
                </VideoElement>
            </VideoMessageElement>
        );
    }

    if (element.type === 'links') {
        return (
            <>
                {element.payload.links.map((link, index) => (
                    <ResponseLink
                        // eslint-disable-next-line react/no-array-index-key
                        key={index}
                        tabIndex={isObscured ? -1 : 0}
                        {...properties}
                        {...{response, elementIndex, link}}
                    />
                ))}
            </>
        );
    }

    return null;
};

export {ResponseItemProperties};
export default ResponseItem;
