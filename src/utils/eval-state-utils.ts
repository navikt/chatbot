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
const englishPreamble = 'To chat with a human, please select a subject:';

const rollePreamble =
    'Gjelder det privatperson, eller tar du kontakt som arbeidsgiver?';

const temaPreamble =
    'Velg et tema du vil chatte med oss om, så setter jeg deg over:';

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
