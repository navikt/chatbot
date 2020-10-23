export const userTypeConstants: Record<string, unknown> = {
    human: 'HUMAN',
    bot: 'BOT'
};

export const eventTypeConstants: Record<string, unknown> = {
    remoteDisconnected: 'USER_DISCONNECTED',
    remoteConnected: 'USER_CONNECTED',
    remoteIsTyping: 'TYPE_MSG',
    userDisconnected: 'REQUEST_DISCONNECTED',
    isQueued: 'REQUEST_PUTINQUEUE'
};
