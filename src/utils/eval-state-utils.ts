import {getCookie, setCookie} from './cookies';
import {MessageWithIndicator} from '../components/ChatContainer';
import {chatStateKeys} from './state-utils';

type EvalState = {
    sent?: boolean;
    veileder?: boolean;
    english?: boolean;
    rollevalg?: string;
    temavalg?: string;
};

// TODO: This is a very non-robust way to detect these selections, which will break if these strings
// are changed on the backend!
const englishPreamble =
    '<a class="bbcode-link" href="https://www.nav.no/en/home" target="_blank">Nav.no in English</a>';

const rollePreamble =
    'Vi kan hjelpe deg med regelverk og informasjon, men ikke sjekke saken din.';

const temaPreamble = 'Velg chatten du vil bli satt over til:';

const findMessageIndexById = (id: number, messages: MessageWithIndicator[]) =>
    messages.findIndex((message) => message.id === id);

export const getEvalState = () =>
    (getCookie(chatStateKeys.EVAL) || {}) as EvalState;

export const setEvalState = (evalState: EvalState) =>
    setCookie(chatStateKeys.EVAL, evalState);

export const updateSelectionState = (
    messageId: number,
    valg: string,
    historie: MessageWithIndicator[]
) => {
    const messageIndex = findMessageIndexById(messageId, historie);
    const preambleMessage = historie[messageIndex - 1];
    if (!preambleMessage) {
        return;
    }

    const evalState = getEvalState();

    switch (preambleMessage.content) {
        case englishPreamble:
            evalState.english = true;
            evalState.rollevalg = valg;
            break;
        case rollePreamble:
            evalState.rollevalg = valg.replace('Chat - ', '');
            break;
        case temaPreamble:
            evalState.temavalg = valg;
            break;
        default:
            return;
    }

    setEvalState(evalState);
};
