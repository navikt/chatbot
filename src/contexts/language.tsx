import React, {
    createContext,
    useContext,
    useState,
    useMemo,
    useEffect,
    useCallback
} from 'react';

import cookies from 'js-cookie';

import {
    cookieDomain,
    clientLanguage,
    languageCookieName
} from '../configuration';

type Translations = Record<string, Record<string, string>>;
type Localizations = Record<string, string>;

function getLocalizations(languageKey: string, translations: Translations) {
    const localizations: Localizations = {};

    Object.entries(translations).forEach(([key, translation]) => {
        if (translation[languageKey]) {
            localizations[key] = translation[languageKey];
        } else {
            localizations[key] = translation[defaultLanguageKey];

            console.warn(
                new Error(`Missing "${languageKey}" translation: ${key}`)
            );
        }
    });

    return localizations;
}

interface LanguageInterface {
    language?: string;
    translate: (translations: Translations) => Localizations;
    setLanguage?: (language: string) => void;
}

const defaultLanguageKey = 'no';
const LanguageContext = createContext<LanguageInterface>({
    translate: (translations: Translations) =>
        getLocalizations(defaultLanguageKey, translations)
});

const LanguageProvider = (properties: Record<string, unknown>) => {
    const [language, setLanguage] = useState<string | undefined>(
        () =>
            clientLanguage ??
            cookies.get(languageCookieName) ??
            defaultLanguageKey
    );

    const translate = useCallback(
        (translations: Translations) =>
            getLocalizations(language ?? defaultLanguageKey, translations),
        [language]
    );

    useEffect(() => {
        if (language) {
            cookies.set(languageCookieName, language, {
                domain: cookieDomain,
                expires: 0.5
            });
        }
    }, [language]);

    const value = useMemo(() => ({language, translate, setLanguage}), [
        language,
        translate
    ]);

    return <LanguageContext.Provider {...properties} value={value} />;
};

const useLanguage = () => useContext(LanguageContext);

export {LanguageContext, LanguageProvider};
export default useLanguage;
