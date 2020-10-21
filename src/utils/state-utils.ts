import {deleteCookie, getCookie, setCookie} from './cookies';
import {
    getStorageItem,
    removeStorageItem,
    setStorageItem
} from './session-storage';
import md5 from 'md5';
import {Config} from '../components/Interaksjonsvindu';
import moment from 'moment';
import {MessageWithIndicator} from '../components/ChatContainer';

export const chatStateKeys = {
    CONFIG: 'chatbot-frida_config',
    HISTORIE: 'chatbot-frida_historie',
    APEN: 'chatbot-frida_apen',
    EVAL: 'chatbot-frida_eval',
    MAILTIMEOUT: 'chatbot-frida_mail-timeout'
};

const sessionTimeoutMins = 30;

export const clearState = () => {
    Object.values(chatStateKeys).forEach((key) => deleteCookie(key));
    removeStorageItem(chatStateKeys.HISTORIE);
};

export const setHistoryCache = (historie: MessageWithIndicator[]) => {
    const jsonString = JSON.stringify(historie);
    setStorageItem(chatStateKeys.HISTORIE, jsonString);
    setCookie(chatStateKeys.HISTORIE, md5(jsonString));
};

export const loadHistoryCache = () => {
    const historie = getStorageItem(chatStateKeys.HISTORIE);
    if (!historie) {
        return null;
    }

    const historieHash = md5(historie);
    if (historieHash !== getCookie(chatStateKeys.HISTORIE)) {
        return null;
    }

    return JSON.parse(historie);
};

export const updateLastActiveTime = (config: Config) => {
    config.lastActive = moment().valueOf();
    setCookie(chatStateKeys.CONFIG, config);
};

export const hasActiveSession = (config: Config | undefined) =>
    config &&
    moment().isBefore(
        moment(config.lastActive).add(sessionTimeoutMins, 'minutes')
    );
