import React, {useMemo, useEffect, useCallback} from 'react';
import styled, {css} from 'styled-components';
import {Innholdstittel} from 'nav-frontend-typografi';
import finishIcon from '../assets/finish.svg';
import minimizeIcon from '../assets/minimize.svg';
import fullscreenIcon from '../assets/maximize.svg';
import contractIcon from '../assets/contract.svg';
import caretDownIcon from '../assets/caret-down.svg';
import useSession from '../contexts/session';
import useLanguage from '../contexts/language';
import AriaLabelElement from './aria-label';
import {fullscreenMediaQuery, contextFilters} from '../configuration';

const translations = {
    chat_with_nav: {
        en: 'Chat with NAV',
        no: 'Chat med NAV'
    },
    choose_context: {
        en: 'Choose context',
        no: 'Velg din rolle'
    },
    private_person: {
        en: 'Private person',
        no: 'Privatperson'
    },
    employer: {
        en: 'Employer',
        no: 'Arbeidsgiver'
    },
    minimize_chat_window: {
        en: 'Minimize chat window',
        no: 'Minimer chatvindu'
    },
    smaller_chat_window: {
        en: 'Use smaller chat window',
        no: 'Bruk mindre chatvindu'
    },
    open_in_fullscreen: {
        en: 'Open chat in fullscreen',
        no: 'Åpne chat i fullskjerm'
    },
    end_chat: {
        en: 'End chat',
        no: 'Avslutt chat'
    }
};

const SelectWrapper = styled(Innholdstittel)`
    position: relative;
`;

const SelectElementIcon = styled.div`
    width: 18px;
    height: 18px;
    position: absolute;
    top: 4px;
    right: 4px;
    pointer-events: none;

    svg {
        width: 100%;
        height: 100%;
    }
`;

const SelectElement = styled.select`
    appearance: none;
    background: none;
    font-size: 22px;
    font-family: 'Source Sans Pro', Arial, sans-serif;
    font-weight: 600;
    margin-top: 7px;
    margin-left: 12px;
    line-height: 1.4em;
    cursor: pointer;
    padding: 2px;
    padding-right: 28px;
    border: 0;

    &:focus {
        outline: none;
        box-shadow: inset 0 0 0 3px #005b82;
        border-radius: 7px;
    }
`;

const ContextSelector = ({...properties}) => {
    const {translate} = useLanguage();
    const {actionFilters, changeContext} = useSession();
    const localizations = useMemo(() => translate(translations), [translate]);

    const handleContextChange = useCallback(
        (event: React.ChangeEvent<HTMLSelectElement>) => {
            const value = event.target.value;
            changeContext?.(value);
        },
        [changeContext]
    );

    const currentContext = useMemo(
        () => actionFilters?.find((value) => contextFilters.includes(value)),
        [actionFilters]
    );

    useEffect(() => {
        if (!currentContext) {
            changeContext?.(contextFilters[0]);
        }
    }, [currentContext, changeContext]);

    return (
        <SelectWrapper>
            <AriaLabelElement>{localizations.choose_context}:</AriaLabelElement>
            <SelectElement
                {...properties}
                value={currentContext}
                onChange={handleContextChange}
            >
                <option value='privatperson'>
                    {localizations.private_person}
                </option>

                <option value='arbeidsgiver'>{localizations.employer}</option>
            </SelectElement>

            <SelectElementIcon
                dangerouslySetInnerHTML={{__html: caretDownIcon}}
            />
        </SelectWrapper>
    );
};

interface HeaderElementProperties {
    isHumanChat?: boolean;
}

const HeaderElement = styled.div`
    background: #fff;
    border-bottom: 1px solid #78706a;
    box-shadow: inset 0 -1px 0 #fff, 0 1px 4px rgba(0, 0, 0, 0.15),
        0 2px 5px rgba(0, 0, 0, 0.1);
    position: relative;
    z-index: 1;
    border-radius: 2px 2px 0 0;
    padding: 2px 0;
    display: flex;
    transition: background-color 0.37s;

    ${(properties: HeaderElementProperties) =>
        properties.isHumanChat &&
        css`
            background-color: #c6c2bf;
            box-shadow: inset 0 -1px 0 rgba(255, 255, 255, 0.3),
                0 1px 4px rgba(0, 0, 0, 0.15), 0 2px 5px rgba(0, 0, 0, 0.1);
        `}

    ${SelectElement} {
        background: none;
    }
`;

const HeaderActionsElement = styled.div`
    margin: auto;
    margin-right: 0;
`;

const IconButtonElement = styled.button`
    appearance: none;
    background: none;
    cursor: pointer;
    width: 48px;
    height: 48px;
    padding: 14px;
    border: 0;

    svg {
        width: 100%;
        height: 100%;
    }

    &:focus {
        outline: none;
        box-shadow: inset 0 0 0 3px #005b82;
        border-radius: 7px;
    }
`;

const FullscreenIconButtonElement = styled(IconButtonElement)`
    @media ${fullscreenMediaQuery} {
        display: none;
    }
`;

const IconElement = styled.span``;

interface HeaderProperties {
    isFullscreen?: boolean;
    isObscured?: boolean;
    onClose?: () => void;
    onToggleFullscreen?: () => void;
    onFinish?: () => void;
}

const Header = ({
    isFullscreen,
    isObscured,
    onClose,
    onToggleFullscreen,
    onFinish,
    ...properties
}: HeaderProperties) => {
    const {translate} = useLanguage();
    const {conversation} = useSession();
    const localizations = useMemo(() => translate(translations), [translate]);
    const isHumanChat = conversation?.state.chat_status === 'assigned_to_human';

    return (
        <HeaderElement
            {...{isHumanChat}}
            aria-hidden={isObscured}
            {...properties}
        >
            <AriaLabelElement>{localizations.chat_with_nav}</AriaLabelElement>

            <ContextSelector
                tabIndex={isObscured ? -1 : 0}
                disabled={isObscured}
            />

            <HeaderActionsElement>
                <IconButtonElement
                    type='button'
                    tabIndex={isObscured ? -1 : 0}
                    disabled={isObscured}
                    onClick={onClose}
                >
                    <IconElement
                        dangerouslySetInnerHTML={{__html: minimizeIcon}}
                    />

                    <AriaLabelElement>
                        {localizations.minimize_chat_window}
                    </AriaLabelElement>
                </IconButtonElement>

                {isFullscreen ? (
                    <FullscreenIconButtonElement
                        type='button'
                        tabIndex={isObscured ? -1 : 0}
                        disabled={isObscured}
                        onClick={onToggleFullscreen}
                    >
                        <IconElement
                            dangerouslySetInnerHTML={{__html: contractIcon}}
                        />

                        <AriaLabelElement>
                            {localizations.smaller_chat_window}
                        </AriaLabelElement>
                    </FullscreenIconButtonElement>
                ) : (
                    <FullscreenIconButtonElement
                        type='button'
                        tabIndex={isObscured ? -1 : 0}
                        disabled={isObscured}
                        onClick={onToggleFullscreen}
                    >
                        <IconElement
                            dangerouslySetInnerHTML={{__html: fullscreenIcon}}
                        />

                        <AriaLabelElement>
                            {localizations.open_in_fullscreen}
                        </AriaLabelElement>
                    </FullscreenIconButtonElement>
                )}

                <IconButtonElement
                    type='button'
                    tabIndex={isObscured ? -1 : 0}
                    disabled={isObscured}
                    onClick={onFinish}
                >
                    <IconElement
                        dangerouslySetInnerHTML={{__html: finishIcon}}
                    />

                    <AriaLabelElement>
                        {localizations.end_chat}
                    </AriaLabelElement>
                </IconButtonElement>
            </HeaderActionsElement>
        </HeaderElement>
    );
};

export {HeaderProperties};
export default Header;
