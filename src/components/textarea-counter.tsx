import React, {useMemo} from 'react';
import styled from 'styled-components';
import useLanguage from '../contexts/language';
import AriaLabelElement from './aria-label';

const CounterOverloadElement = styled.span`
    color: #c30000;
`;

const translations = {
    _characters_used: {
        en: 'characters used',
        no: 'tegn brukt'
    }
};

interface CounterProperties {
    count: number;
    maxCount: number;
}

const Counter = ({count, maxCount}: CounterProperties) => {
    const {translate} = useLanguage();
    const localizations = useMemo(() => translate(translations), [translate]);
    const text = `${count}/${maxCount}`;

    if (count <= maxCount) {
        return (
            <span>
                {text}{' '}
                <AriaLabelElement>
                    {localizations._characters_used}
                </AriaLabelElement>
            </span>
        );
    }

    return (
        <CounterOverloadElement>
            {text}{' '}
            <AriaLabelElement>
                {localizations._characters_used}
            </AriaLabelElement>
        </CounterOverloadElement>
    );
};

export default Counter;
