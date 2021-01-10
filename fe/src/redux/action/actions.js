export const ActionType = {
    CHAT_ON: "CHAT_ON",
    CHAT_OFF: "CHAT_OFF"
}

export const setChatOn = (payload) => {
    return {
        type: ActionType.CHAT_ON,
        payload: payload
    }
}

export const setChatOff = (payload) => {
    return {
        type: ActionType.CHAT_OFF,
        payload: payload
    }
}