import React, {
    createContext,
    useContext,
    useMemo,
    useCallback,
    useState,
    useEffect
} from 'react';

import axios from 'axios';
import cookies from 'js-cookie';
import useLoader from '../hooks/use-loader';

import {
    boostApiUrlBase as defaultBoostApiUrlBase,
    cookieDomain,
    cacheSessionName,
    actionFilterCacheSessionName,
    clientLanguage,
    conversationIdCookieName,
    minimumPollTimeout,
    agentMaximumPollTimeout,
    botMaximumPollTimeout,
    contextFilters
} from '../configuration';

import useLanguage from './language';

const contextFiltersConstant = [...contextFilters] as const;
type ContextFilter = typeof contextFiltersConstant[number];

interface BoostConversation {
    id: string;
    reference: string;
    state: {
        chat_status: string;
        poll: boolean;
        human_is_typing: boolean;
        max_input_chars: number;
    };
}

interface BoostResponseElementText {
    type: 'text';
    payload: {
        text: string;
    };
}

interface BoostResponseElementHtml {
    type: 'html';
    payload: {
        html: string;
    };
}

interface BoostResponseElementVideo {
    type: 'video';
    payload: {
        fullscreen: true | false;
        source: 'vimeo';
        url: string;
    };
}

interface BoostResponseElementLinksItem {
    id: string;
    text: string;
    type: string;
    link_target: string;
    url?: string;
}

interface BoostResponseElementLinks {
    type: 'links';
    payload: {
        links: BoostResponseElementLinksItem[];
    };
}

type BoostResponseElement =
    | BoostResponseElementText
    | BoostResponseElementHtml
    | BoostResponseElementVideo
    | BoostResponseElementLinks;

interface BoostResponse {
    id: string;
    language?: string;
    is_human_agent?: boolean;
    source: string;
    feedback?: 'positive' | 'remove-positive' | 'negative' | 'remove-negative';
    avatar_url?: string;
    date_created: string;
    elements: BoostResponseElement[];
    link_text?: string;
}

interface BoostStartRequestResponse {
    conversation: BoostConversation;
    response: BoostResponse;
}

async function createBoostSession(
    apiUrlBase: string,
    actionFilters?: string[]
): Promise<BoostStartRequestResponse> {
    const response = await axios.post(apiUrlBase, {
        command: 'START',
        language: clientLanguage,
        filter_values: actionFilters
    });

    return response.data;
}

interface BoostResumeRequestResponse {
    conversation: BoostConversation;
    responses: BoostResponse[];
}

interface BoostResumeRequestOptions {
    language: string | undefined;
}

async function getBoostSession(
    apiUrlBase: string,
    conversationId: string,
    options?: BoostResumeRequestOptions
): Promise<BoostResumeRequestResponse> {
    const response = await axios.post(apiUrlBase, {
        command: 'RESUME',
        conversation_id: conversationId,
        language: options?.language
    });

    return response.data;
}

interface BoostPollRequestResponse {
    conversation: BoostConversation;
    responses: BoostResponse[];
}

interface BoostPollRequestOptions {
    mostRecentResponseId: string | undefined;
}

async function pollBoostSession(
    apiUrlBase: string,
    conversationId: string,
    actionFilters: string[],
    options?: BoostPollRequestOptions
): Promise<BoostPollRequestResponse> {
    const response = await axios.post(apiUrlBase, {
        command: 'POLL',
        conversation_id: conversationId,
        value: options?.mostRecentResponseId,
        filter_values: actionFilters
    });

    return response.data;
}

interface BoostPostRequestResponse {
    posted_id: number;
    conversation: BoostConversation;
    response: BoostResponse;
}

interface BoostPostRequestOptionsText {
    type: 'text';
    message: string;
}

interface BoostPostRequestOptionsLink {
    type: 'action_link' | 'external_link';
    id: string;
}

interface BoostPostRequestOptions {
    type: string;
    id?: string;
    value?: string;
}

async function postBoostSession(
    apiUrlBase: string,
    conversationId: string,
    actionFilters: string[],
    options: BoostPostRequestOptionsText | BoostPostRequestOptionsLink
): Promise<BoostPostRequestResponse> {
    const requestOptions: BoostPostRequestOptions = {type: options.type};

    switch (options.type) {
        case 'text': {
            requestOptions.value = options.message;
            break;
        }

        case 'action_link': {
            requestOptions.id = options.id;
            break;
        }

        case 'external_link': {
            requestOptions.id = options.id;
            break;
        }

        // no default
    }

    const response = await axios.post(apiUrlBase, {
        command: 'POST',
        conversation_id: conversationId,
        filter_values: actionFilters,
        ...requestOptions
    });

    return response.data;
}

interface BoostPingRequestResponse {
    conversation: BoostConversation;
}

async function pingBoostSession(
    apiUrlBase: string,
    conversationId: string
): Promise<BoostPingRequestResponse> {
    const response = await axios.post(apiUrlBase, {
        command: 'TYPING',
        conversation_id: conversationId
    });

    return response.data;
}

interface BoostStopRequestResponse {
    conversation: BoostConversation;
}

async function stopBoostSession(
    apiUrlBase: string,
    conversationId: string
): Promise<BoostStopRequestResponse> {
    const response = await axios.post(apiUrlBase, {
        command: 'STOP',
        conversation_id: conversationId
    });

    return response.data;
}

interface BoostRateRequestResponse {
    conversation: BoostConversation;
}

type RateBoostResponseAction = BoostResponse['feedback'];

async function rateBoostResponse(
    apiUrlBase: string,
    conversationId: string,
    data: {
        id: string;
        action: RateBoostResponseAction;
    }
) {
    const response = await axios.post(apiUrlBase, {
        command: 'POST',
        type: 'feedback',
        conversation_id: conversationId,
        id: data.id,
        value: data.action
    });

    return response.data;
}

async function rateBoostSession(
    apiUrlBase: string,
    conversationId: string,
    data: {rating: number; message?: string}
): Promise<BoostRateRequestResponse> {
    const response = await axios.post(apiUrlBase, {
        command: 'FEEDBACK',
        conversation_id: conversationId,
        value: {
            rating: data.rating,
            text: data.message
        }
    });

    return response.data;
}

async function downloadBoostSession(
    apiUrlBase: string,
    conversationId: string
): Promise<Blob> {
    const response = await axios.post(apiUrlBase, {
        command: 'DOWNLOAD',
        conversation_id: conversationId
    });

    return new Blob([response.data], {type: 'text/plain;charset=utf-8'});
}

type BoostRequestResponse =
    | BoostStartRequestResponse
    | BoostResumeRequestResponse
    | BoostPollRequestResponse;

interface Cache {
    conversation?: BoostConversation;
    responses?: BoostResponse[];
}

function setCache(data: Cache): void {
    if (window.sessionStorage) {
        window.sessionStorage.setItem(cacheSessionName, JSON.stringify(data));
    }
}

function getCache(): Cache | undefined {
    if (window.sessionStorage) {
        const data = window.sessionStorage.getItem(cacheSessionName);

        if (data) {
            try {
                return JSON.parse(data);
            } catch (error) {
                console.error(error);
            }
        }
    }

    return undefined;
}

function removeCache(): void {
    if (window.sessionStorage) {
        window.sessionStorage.removeItem(cacheSessionName);
    }
}

function setActionFilterCache(actionFilters: string[]) {
    if (window.sessionStorage) {
        window.sessionStorage.setItem(
            actionFilterCacheSessionName,
            JSON.stringify(actionFilters)
        );
    }
}

function getActionFilterCache(): string[] | undefined {
    if (window.sessionStorage) {
        const data = window.sessionStorage.getItem(
            actionFilterCacheSessionName
        );

        if (data) {
            try {
                return JSON.parse(data);
            } catch (error) {
                console.error(error);
            }
        }
    }

    return undefined;
}

function removeActionFilterCache(): void {
    if (window.sessionStorage) {
        window.sessionStorage.removeItem(actionFilterCacheSessionName);
    }
}

interface SessionError extends Error {
    code?: string;
}

type SendActionOptions = {
    actionFilters?: string[];
};

interface Session {
    id?: string;
    status?:
        | 'disconnected'
        | 'connecting'
        | 'connected'
        | 'restarting'
        | 'error'
        | 'ended';
    error?: SessionError;
    conversation?: BoostConversation;
    responses?: BoostResponse[];
    queue?: BoostResponse;
    actionFilters?: string[];
    isLoading?: boolean;
    hasSpokenToAgent?: boolean;
    start?: () => Promise<void>;
    restart?: () => Promise<void>;
    finish?: () => Promise<void>;
    download?: () => Promise<void>;
    sendMessage?: (message: string) => Promise<void>;
    sendAction?: (
        actionId: string,
        options: SendActionOptions
    ) => Promise<void>;
    sendLink?: (linkId: string) => Promise<void>;
    sendPing?: () => Promise<void>;
    sendFeedback?: (rating: number, message?: string) => Promise<void>;
    sendMessageFeedback?: (
        id: string,
        action: RateBoostResponseAction
    ) => Promise<void>;
    updateActionFilters?: (
        callback: (previousState: string[]) => string[]
    ) => void;
    changeContext?: (newContext: ContextFilter) => void;
}

const SessionContext = createContext<Session>({});

interface SessionProperties {
    boostApiUrlBase?: string;
    actionFilters?: string[];
}

const SessionProvider = (properties: SessionProperties) => {
    const boostApiUrlBase =
        properties.boostApiUrlBase ?? defaultBoostApiUrlBase;
    const [actionFilters, updateActionFilters] = useState<string[]>(
        properties.actionFilters ?? []
    );

    const [status, setStatus] = useState<Session['status']>('disconnected');
    const [error, setError] = useState<SessionError>();
    const [errorCount, setErrorCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useLoader();
    const {language, setLanguage} = useLanguage();

    const [savedConversationId, setSavedConversationId] = useState<
        string | undefined
    >(() => cookies.get(conversationIdCookieName));

    const [conversation, setConversation] = useState<
        BoostConversation | undefined
    >();

    const conversationId = conversation?.id;
    const conversationState = conversation?.state;

    const [responses, setResponses] = useState<BoostResponse[] | undefined>();
    const [queue, setQueue] = useState<BoostResponse>();
    const [pollMultiplier, setPollMultiplier] = useState<number>(1);
    const [hasSpokenToAgent, setHasSpokenToAgent] = useState<boolean>(false);

    const handleError = useCallback(
        (error: any, isDismissible = false) => {
            if (
                error?.response &&
                error.response.data.error === 'session ended'
            ) {
                setStatus('ended');
                return;
            }

            if (isDismissible !== true || errorCount > 1) {
                if (error.message.toLowerCase() === 'network error') {
                    const error: SessionError = new Error('Network error');
                    error.code = 'network_error';
                    setError(error);
                }

                setStatus('error');
            } else {
                setErrorCount((number) => number + 1);
            }
        },
        [errorCount]
    );

    const update = useCallback(
        (updates: BoostRequestResponse) => {
            if (conversation) {
                if (conversationId === updates.conversation.id) {
                    const currentState = JSON.stringify(conversationState);
                    const updatedState = JSON.stringify(
                        updates.conversation.state
                    );

                    if (currentState !== updatedState) {
                        setConversation(updates.conversation);
                    }
                } else {
                    setConversation(updates.conversation);
                }
            } else {
                setConversation(updates.conversation);
            }

            const responses =
                'response' in updates ? [updates.response] : updates.responses;

            if (responses.length === 0) {
                return;
            }

            const [mostRecentResponse] = responses.slice(-1);

            if (mostRecentResponse?.language) {
                const [updatedLanguage] =
                    mostRecentResponse.language.split('-');

                setLanguage!(updatedLanguage);
            }

            setQueue((previousQueue) => {
                if (previousQueue) {
                    const messages: string[] = [];

                    for (const response of responses) {
                        for (const element of response.elements) {
                            if (element.type === 'text') {
                                messages.push(element.payload.text);
                            }
                        }
                    }

                    const updatedElements = previousQueue.elements.filter(
                        (element) =>
                            element.type === 'text' &&
                            !messages.includes(element.payload.text)
                    );

                    if (updatedElements.length === 0) {
                        return undefined;
                    }

                    return {
                        ...previousQueue,
                        elements: updatedElements
                    };
                }

                return previousQueue;
            });

            if (!responses) {
                return;
            }

            setResponses((previousResponses) => {
                if (previousResponses) {
                    const currentResponseIds = new Set(
                        previousResponses.map((index) => String(index.id))
                    );

                    for (const response of responses) {
                        const stringedResponseId = String(response.id);

                        if (currentResponseIds.has(stringedResponseId)) {
                            const currentResponseIndex =
                                previousResponses.findIndex(
                                    (index) =>
                                        String(index.id) === stringedResponseId
                                );

                            if (currentResponseIndex >= 0) {
                                Object.assign(
                                    previousResponses[currentResponseIndex],
                                    response
                                );
                            }
                        }
                    }

                    for (const response of responses) {
                        if (!currentResponseIds.has(String(response.id))) {
                            previousResponses.push(response);
                        }
                    }

                    previousResponses.sort(
                        (a, b) =>
                            Number.parseInt(a.id, 10) -
                            Number.parseInt(b.id, 10)
                    );

                    return previousResponses.slice();
                }

                if ('response' in updates) {
                    const response = updates.response;
                    response.date_created = new Date().toISOString();
                    // NOTE: 'START' request returns wrong creation date (shifted one hour back)

                    return [response];
                }

                return updates.responses;
            });
        },
        [conversation, conversationId, conversationState, setLanguage]
    );

    const sendMessage = useCallback(
        async (message: string) => {
            if (conversationId) {
                const finishLoading = setIsLoading();

                setQueue((previousQueue) => {
                    if (!previousQueue) {
                        previousQueue = {
                            id: 'local',
                            source: 'local',
                            date_created: new Date().toISOString(),
                            elements: []
                        };
                    }

                    return {
                        ...previousQueue,
                        elements: previousQueue.elements.concat({
                            type: 'text',
                            payload: {text: message}
                        })
                    };
                });

                const response = await postBoostSession(
                    boostApiUrlBase,
                    conversationId,
                    actionFilters,
                    {
                        type: 'text',
                        message
                    }
                ).catch((error) => {
                    handleError(error);
                });

                if (response && response.response) {
                    update({
                        conversation: response.conversation,
                        responses: [
                            {
                                id: String(response.posted_id),
                                date_created: new Date().toISOString(),
                                source: 'client',
                                language,
                                elements: [
                                    {
                                        type: 'text',
                                        payload: {text: message}
                                    }
                                ]
                            },
                            {
                                ...response.response,
                                // NOTE: 'POST' request returns wrong creation date (shifted one hour back)
                                date_created: new Date().toISOString()
                            }
                        ]
                    });
                }

                setPollMultiplier(0.1);
                finishLoading();
            }
        },
        [
            boostApiUrlBase,
            conversationId,
            actionFilters,
            update,
            language,
            setIsLoading,
            handleError
        ]
    );

    const sendAction = useCallback(
        async (id: string, options: SendActionOptions) => {
            if (conversationId) {
                const finishLoading = setIsLoading();
                const response = await postBoostSession(
                    boostApiUrlBase,
                    conversationId,
                    options?.actionFilters || actionFilters,
                    {
                        type: 'action_link',
                        id
                    }
                ).catch((error) => {
                    handleError(error);
                });

                if (response) {
                    update({
                        conversation: response.conversation,
                        responses: [
                            {
                                ...response.response,
                                // NOTE: 'POST' request returns wrong creation date (shifted one hour back)
                                date_created: new Date().toISOString()
                            }
                        ]
                    });
                }

                setPollMultiplier(0.1);
                finishLoading();
            }
        },
        [
            boostApiUrlBase,
            conversationId,
            actionFilters,
            update,
            setIsLoading,
            handleError
        ]
    );

    const sendLink = useCallback(
        async (id: string) => {
            if (conversationId) {
                const finishLoading = setIsLoading();
                const response = await postBoostSession(
                    boostApiUrlBase,
                    conversationId,
                    actionFilters,
                    {
                        type: 'external_link',
                        id
                    }
                ).catch((error) => {
                    handleError(error);
                });

                if (response) {
                    update({
                        conversation: response.conversation,
                        responses: [
                            {
                                ...response.response,
                                // NOTE: 'POST' request returns wrong creation date (shifted one hour back)
                                date_created: new Date().toISOString()
                            }
                        ]
                    });
                }

                finishLoading();
            }
        },
        [
            boostApiUrlBase,
            conversationId,
            actionFilters,
            update,
            setIsLoading,
            handleError
        ]
    );

    const sendPing = useCallback(async () => {
        const isHumanChat =
            conversationState?.chat_status === 'assigned_to_human';

        if (conversationId && isHumanChat) {
            await pingBoostSession(boostApiUrlBase, conversationId).catch(
                (error) => {
                    console.error(error);
                }
            );
        }
    }, [boostApiUrlBase, conversationId, conversationState]);

    const sendFeedback = useCallback(
        async (rating: number, message?: string) => {
            if (conversationId) {
                await rateBoostSession(boostApiUrlBase, conversationId, {
                    rating,
                    message
                }).catch((error) => {
                    console.error(error);
                });
            }
        },
        [boostApiUrlBase, conversationId]
    );

    const sendMessageFeedback = useCallback(
        async (id: string, action: RateBoostResponseAction) => {
            if (conversationId) {
                await rateBoostResponse(boostApiUrlBase, conversationId, {
                    id,
                    action
                }).catch((error) => {
                    console.error(error);
                });
            }
        },
        [boostApiUrlBase, conversationId]
    );

    const changeContext = useCallback((newContext: ContextFilter) => {
        updateActionFilters((previousActionFilters: string[]) => {
            const updatedActionFilters = previousActionFilters.filter(
                (filter) => !contextFilters.includes(filter)
            );

            return updatedActionFilters.concat(newContext);
        });
    }, []);

    const mergeActionFilters = useCallback((newActionFilters: string[]) => {
        updateActionFilters((previousState) => {
            let filters = [...previousState];
            const contextFilter = newActionFilters.find((filter) =>
                contextFilters.includes(filter)
            );

            if (contextFilter) {
                filters = filters.filter(
                    (filter) => !contextFilters.includes(filter)
                );
            }

            return [...new Set(filters.concat(newActionFilters))];
        });
    }, []);

    const start = useCallback(async () => {
        const finishLoading = setIsLoading();
        setStatus('connecting');

        try {
            if (savedConversationId) {
                const cache = getCache();

                if (cache) {
                    update(cache as BoostResumeRequestResponse);
                }

                const actionFilterCache = getActionFilterCache();

                if (actionFilterCache) {
                    mergeActionFilters(actionFilterCache);
                }

                const session = await getBoostSession(
                    boostApiUrlBase,
                    savedConversationId,
                    {
                        language
                    }
                ).catch(async (error) => {
                    if (error?.response?.data?.error === 'session ended') {
                        return createBoostSession(
                            boostApiUrlBase,
                            actionFilters
                        );
                    }

                    throw error;
                });

                update(session);
            } else {
                const session = await createBoostSession(
                    boostApiUrlBase,
                    actionFilters
                );

                update(session);
            }

            setStatus('connected');
        } catch (error) {
            handleError(error);
        }

        finishLoading();
    }, [
        boostApiUrlBase,
        actionFilters,
        savedConversationId,
        language,
        setIsLoading,
        update,
        mergeActionFilters,
        handleError
    ]);

    const remove = useCallback(async () => {
        updateActionFilters(properties.actionFilters ?? []);
        setSavedConversationId(undefined);
        setConversation(undefined);
        setResponses(undefined);
        setQueue(undefined);

        removeCache();
        removeActionFilterCache();
        cookies.remove(conversationIdCookieName, {domain: cookieDomain});

        if (conversationId) {
            await stopBoostSession(boostApiUrlBase, conversationId).catch(
                (error) => {
                    console.error(error);
                }
            );
        }
    }, [properties.actionFilters, boostApiUrlBase, conversationId]);

    const restart = useCallback(async () => {
        const finishLoading = setIsLoading();
        setStatus('restarting');
        await remove();
        setStatus('connecting');

        try {
            const createdSession = await createBoostSession(boostApiUrlBase);
            update(createdSession);
            setStatus('connected');
        } catch (error) {
            handleError(error);
        }

        finishLoading();
    }, [boostApiUrlBase, remove, setIsLoading, update, handleError]);

    const finish = useCallback(async () => {
        const finishLoading = setIsLoading();
        setStatus('ended');
        await remove();
        finishLoading();
    }, [remove, setIsLoading]);

    const download = useCallback(async () => {
        if (conversationId) {
            try {
                const blob = await downloadBoostSession(
                    boostApiUrlBase,
                    conversationId
                );

                const url = URL.createObjectURL(blob);
                const anchor = document.createElement('a');

                anchor.style.display = 'none';
                anchor.setAttribute('href', url);
                anchor.setAttribute(
                    'download',
                    `nav-chatlog-${Date.now()}.txt`
                );

                if (typeof anchor.download === undefined) {
                    anchor.setAttribute('target', '_blank');
                }

                document.body.append(anchor);
                anchor.click();
                anchor.remove();

                window.setTimeout(() => {
                    URL.revokeObjectURL(url);
                }, 250);
            } catch (error) {
                handleError(error);
            }
        }
    }, [boostApiUrlBase, conversationId, handleError]);

    useEffect(() => {
        if (conversationId) {
            const isHumanChat =
                conversationState?.chat_status === 'assigned_to_human';
            const maximumPollTimeout = isHumanChat
                ? agentMaximumPollTimeout
                : botMaximumPollTimeout;
            let timeout: number;
            let shouldUpdate = true;

            if (isHumanChat && !hasSpokenToAgent) {
                setHasSpokenToAgent(true);
            }

            const poll = async () => {
                if (!conversationId || !shouldUpdate) {
                    return;
                }

                const [mostRecentResponse] = (responses ?? []).slice(-1);
                const mostRecentResponseId = mostRecentResponse.id;

                if (!conversationState?.poll) {
                    timeout = window.setTimeout(poll, minimumPollTimeout);
                    return;
                }

                await pollBoostSession(
                    boostApiUrlBase,
                    conversationId,
                    actionFilters,
                    {
                        mostRecentResponseId
                    }
                )
                    .then((updatedSession) => {
                        if (
                            status !== 'disconnected' &&
                            status !== 'ended' &&
                            shouldUpdate
                        ) {
                            setErrorCount(0);
                            setStatus('connected');
                        }

                        if (updatedSession.conversation.state.poll) {
                            if (updatedSession.responses.length === 0) {
                                setPollMultiplier((number) => number + 0.25);
                            } else {
                                setPollMultiplier(1);
                            }
                        } else {
                            setPollMultiplier(Number.POSITIVE_INFINITY);
                        }

                        if (shouldUpdate) {
                            update(updatedSession);
                        }
                    })
                    .catch((error) => {
                        if (shouldUpdate) {
                            handleError(error, true);
                        }
                    })
                    .then(() => {
                        timeout = window.setTimeout(
                            poll,
                            Math.min(
                                maximumPollTimeout,
                                minimumPollTimeout * pollMultiplier
                            )
                        );
                    });
            };

            timeout = window.setTimeout(
                poll,
                Math.min(
                    maximumPollTimeout,
                    minimumPollTimeout * pollMultiplier
                )
            );

            return () => {
                shouldUpdate = false;

                if (timeout) {
                    clearTimeout(timeout);
                }
            };
        }

        return undefined;
    }, [
        boostApiUrlBase,
        actionFilters,
        status,
        hasSpokenToAgent,
        conversationId,
        conversationState,
        responses,
        pollMultiplier,
        update,
        handleError
    ]);

    useEffect(() => {
        if (conversation && responses) {
            setCache({conversation, responses});
        }
    }, [conversation, responses]);

    useEffect(() => {
        if (actionFilters) {
            setActionFilterCache(actionFilters);
        }
    }, [actionFilters]);

    useEffect(() => {
        if (properties.actionFilters) {
            mergeActionFilters(properties.actionFilters);
        }
    }, [mergeActionFilters, properties.actionFilters]);

    useEffect(() => {
        if (conversationId) {
            const options = {domain: cookieDomain, expires: 0.5};
            setSavedConversationId(conversationId);
            cookies.set(conversationIdCookieName, conversationId, options);
        }
    }, [conversationId]);

    useEffect(() => {
        if (status === 'disconnected' && savedConversationId) {
            void start();
        }
    }, [start, status, savedConversationId]);

    const value = useMemo(
        () => ({
            id: conversationId,
            status,
            error,
            conversation,
            responses,
            queue,
            actionFilters,
            isLoading,
            hasSpokenToAgent,
            sendMessage,
            sendAction,
            sendLink,
            sendPing,
            sendFeedback,
            sendMessageFeedback,
            updateActionFilters,
            changeContext,
            start,
            restart,
            finish,
            download
        }),
        [
            conversationId,
            status,
            error,
            conversation,
            queue,
            actionFilters,
            isLoading,
            hasSpokenToAgent,
            responses,
            sendMessage,
            sendAction,
            sendLink,
            sendPing,
            sendFeedback,
            sendMessageFeedback,
            updateActionFilters,
            changeContext,
            start,
            restart,
            finish,
            download
        ]
    );

    return <SessionContext.Provider {...properties} value={value} />;
};

const useSession = () => useContext(SessionContext);

export {
    BoostConversation,
    BoostResponse,
    BoostResponseElement,
    BoostResponseElementLinksItem,
    SessionProperties,
    Session,
    SessionContext,
    SessionProvider
};

export default useSession;
