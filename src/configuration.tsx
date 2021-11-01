const cookieDomain =
    window.location.hostname === 'localhost' ? undefined : '.nav.no';

let internalClientLanguage = 'no';

if (window.location.href.includes('/en/')) {
    internalClientLanguage = 'en';
}

const clientLanguage = internalClientLanguage;
const boostApiUrlBase = 'https://staging-nav.boost.ai/api/chat/v2';
const conversationIdCookieName = 'nav-chatbot:conversation';
const languageCookieName = 'nav-chatbot:language';
const openCookieName = 'nav-chatbot:open';
const consentCookieName = 'nav-chatbot:consent';
const unreadCookieName = 'nav-chatbot:unread';
const cacheSessionName = 'nav-chatbot:cache';
const actionFilterCacheSessionName = 'nav-chatbot:cache-action_filters';
const containerWidthNumber = 480;
const containerWidth = `${containerWidthNumber}px`;
const containerHeightNumber = 740;
const containerHeight = `${containerHeightNumber}px`;
const linkDisableTimeout = 1000 * 10;
const botResponseRevealDelay = 1250;
const botResponseRevealDelayBuffer = botResponseRevealDelay / 2;
const minimumPollTimeout = 1000;
const agentMaximumPollTimeout = 4000;
const botMaximumPollTimeout = 30000;
const authenticationMessagePrefix = 'Init:Auth:';
const contextFilters = ['privatperson', 'arbeidsgiver'];
const englishButtonText = 'For English, click here';
const englishButtonResponse = 'English, please';
const employerButtonText = 'Jeg er arbeidsgiver';
const personButtonText = 'Jeg er ikke arbeidsgiver';

const fullscreenMediaQuery = `(max-width: ${containerWidthNumber + 100}px)`;
const navigationMinimizationMediaQuery = `(max-width: ${
    containerWidthNumber + 150
}px), (max-height: ${containerHeightNumber + 150}px)`;

export {
    cookieDomain,
    clientLanguage,
    boostApiUrlBase,
    conversationIdCookieName,
    languageCookieName,
    openCookieName,
    consentCookieName,
    unreadCookieName,
    cacheSessionName,
    actionFilterCacheSessionName,
    containerWidthNumber,
    containerWidth,
    containerHeightNumber,
    containerHeight,
    linkDisableTimeout,
    botResponseRevealDelay,
    botResponseRevealDelayBuffer,
    minimumPollTimeout,
    agentMaximumPollTimeout,
    botMaximumPollTimeout,
    authenticationMessagePrefix,
    contextFilters,
    englishButtonText,
    englishButtonResponse,
    employerButtonText,
    personButtonText,
    fullscreenMediaQuery,
    navigationMinimizationMediaQuery
};
