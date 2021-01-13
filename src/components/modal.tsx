import React, {useRef, useEffect, useMemo, useState} from 'react';
import styled, {css} from 'styled-components';
import {Systemtittel, Normaltekst} from 'nav-frontend-typografi';
import finishIcon from '../assets/finish.svg';
import useLanguage from '../contexts/language';
import AriaLabelElement from './aria-label';

const Element = styled.dialog`
    background: rgba(255, 255, 255, 0.6);
    width: 100%;
    height: 100%;
    padding: 20px;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 10;
    bottom: 0;
    left: 0;
    border: 0;
    opacity: 0;
    transition: opacity 0.3s;
    pointer-events: none;
    box-sizing: border-box;
    display: flex;

    ${(properties: {internalIsOpen?: boolean}) =>
        properties.internalIsOpen &&
        css`
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            opacity: 1;
            pointer-events: all;
        `};
`;

const ButtonElement = styled.button`
    appearance: none;
    background: #fff;
    cursor: pointer;
    width: 48px;
    height: 52px;
    padding: 16px 14px;
    border: 0;
    border-radius: 0 0 0 6px;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3);
    position: absolute;
    top: 0;
    right: 0;
    z-index: 10;

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

const Icon = styled.span``;

const ContentsElement = styled.div`
    height: 100%;
    margin: auto;
    transition: transform 0.2s, opacity 0.1s;
    transform: scale(0.8);
    opacity: 0;
    display: flex;

    ${(properties: {isOpen?: boolean}) =>
        properties.isOpen &&
        css`
            opacity: 1;
            transform: none;
        `};
`;

const BoxElement = styled.div`
    background: #fff;
    max-height: 100%;
    box-sizing: border-box;
    position: relative;
    overflow: auto;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    padding: 0 20px;
    border-radius: 4px;
    margin: auto;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.15),
        0 1px 10px rgba(0, 0, 0, 0.1);

    &::before,
    &::after {
        content: '';
        width: 100%;
        height: 20px;
        position: sticky;
        position: -webkit-sticky;
        z-index: 1;
        display: block;
    }

    &::before {
        background: linear-gradient(#fff 25%, rgba(255, 255, 255, 0) 100%);
        top: 0;
    }

    &::after {
        background: linear-gradient(rgba(255, 255, 255, 0) 0%, #fff 75%);
        bottom: 0;
    }
`;

const TitleElement = styled(Systemtittel)`
    font-size: 20px;
`;

const HeadingElement = styled(Systemtittel)`
    font-size: 17px;
    margin-top: 4px;
`;

const TextElement = styled(Normaltekst)`
    font-size: 17px;
    margin-bottom: 18px;

    ${TitleElement} + & {
        margin-top: 4px;
    }
`;

const ActionsElement = styled.div`
    width: 100%;
    margin-top: 12px;
    display: flex;
    justify-content: flex-end;
`;

const translations = {
    close: {
        en: 'Close',
        no: 'Lukk'
    }
};

interface ModalProperties {
    isOpen?: boolean;
    confirmationButtonText?: string;
    children?: React.ReactNode;
    onConfirm?: () => void;
}

const Modal = ({
    isOpen,
    confirmationButtonText,
    onConfirm,
    children
}: ModalProperties) => {
    const reference = useRef<HTMLDivElement>();
    const {translate} = useLanguage();
    const localizations = useMemo(() => translate(translations), [translate]);
    const [internalIsOpen, setInternalIsOpen] = useState(isOpen);

    useEffect(() => {
        if (isOpen && reference.current) {
            reference.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            setInternalIsOpen(true);
        } else {
            const timeout = window.setTimeout(() => {
                setInternalIsOpen(false);
            }, 125);

            return () => {
                clearTimeout(timeout);
            };
        }

        return undefined;
    }, [isOpen]);

    return (
        <Element
            ref={reference as any}
            {...{isOpen, internalIsOpen}}
            aria-modal={isOpen}
            aria-hidden={!isOpen}
            open={isOpen}
        >
            <ButtonElement
                type='button'
                tabIndex={isOpen ? undefined : -1}
                disabled={!isOpen}
                onClick={onConfirm}
            >
                <Icon dangerouslySetInnerHTML={{__html: finishIcon}} />
                <AriaLabelElement>
                    {confirmationButtonText ?? localizations.close}
                </AriaLabelElement>
            </ButtonElement>

            <ContentsElement {...{isOpen}}>{children}</ContentsElement>
        </Element>
    );
};

export {
    ModalProperties,
    BoxElement,
    TitleElement,
    HeadingElement,
    TextElement,
    ActionsElement
};

export default Modal;
