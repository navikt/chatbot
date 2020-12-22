import React, {useMemo} from 'react';
import styled from 'styled-components';
import {LenkepanelBase} from 'nav-frontend-lenkepanel';
import {Ingress, Normaltekst, Undertekst} from 'nav-frontend-typografi';
import idPortenIcon from '../assets/id-porten.svg';
import useLanguage from '../contexts/language';
import {BoostResponse, BoostResponseElement} from '../contexts/session';
import Spinner from './spinner';
import Conversation, {GroupElement} from './message';
import ResponseLink, {ResponseLinkProperties} from './response-link';
import {authenticationPrefix} from '../configuration';

const ContentsElement = styled.span`
    p {
        margin: 0;
        padding: 0;
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

const translations = {
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
}

const Contents = ({html}: ContentsProperties) => {
    const output = useMemo(() => {
        const regexp = /(^|\s)(https?:\/\/\S+)($|\s)/gm;
        const matches = html.match(regexp);

        if (matches) {
            return html.replace(regexp, (string, prefix, match, suffix) => {
                if (match) {
                    const url = String(match);

                    return `${String(
                        prefix
                    )}<a href="${url}">${url}</a>${String(suffix)}`;
                }

                return string;
            });
        }

        return html;
    }, [html]);

    return (
        <ContentsElement
            role='text'
            dangerouslySetInnerHTML={{__html: output}}
        />
    );
};

interface ResponseItemProperties extends Omit<ResponseLinkProperties, 'link'> {
    responseIndex?: number;
    element: BoostResponseElement;
    responses?: BoostResponse[];
    responsesLength?: number;
    isObscured?: boolean;
}

const ResponseItem = ({
    response,
    responseIndex,
    element,
    responses,
    responsesLength,
    isObscured,
    ...properties
}: ResponseItemProperties) => {
    const {translate} = useLanguage();
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

    if (element.type === 'text') {
        const {text} = element.payload;

        if (response.source === 'local') {
            return (
                <div style={{opacity: 0.7}}>
                    <Conversation alignment='right'>{text}</Conversation>

                    <SubtextElement>
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
                    <Conversation alignment='right'>{text}</Conversation>

                    {displaySentIndicator && (
                        <SubtextElement>{localizations.sent}</SubtextElement>
                    )}
                </>
            );
        }

        return (
            <Conversation avatarUrl={response.avatar_url}>{text}</Conversation>
        );
    }

    if (element.type === 'html') {
        const html = String(element.payload.html);

        if (html.startsWith(authenticationPrefix)) {
            const [, authenticationUrl] = html.split(authenticationPrefix);

            return (
                <LinkPanelElement
                    border
                    href={authenticationUrl}
                    tabIndex={isObscured ? -1 : 0}
                    target='_blank'
                >
                    <LinkPanelIconElement
                        dangerouslySetInnerHTML={{
                            __html: idPortenIcon
                        }}
                    />

                    <LinkPanelTextElement>
                        <Ingress>
                            {localizations.electronic_authentication}
                        </Ingress>
                        <Normaltekst>{localizations.please_log_in}</Normaltekst>
                    </LinkPanelTextElement>
                </LinkPanelElement>
            );
        }

        return (
            <Conversation avatarUrl={response.avatar_url}>
                <Contents {...{html}} />
            </Conversation>
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
                        {...{response, link}}
                    />
                ))}
            </>
        );
    }

    return null;
};

export {ResponseItemProperties};
export default ResponseItem;
