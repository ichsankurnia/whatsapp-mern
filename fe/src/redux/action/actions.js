export const ActionType = {
    CHAT_ON: "CHAT_ON",
    CHAT_OFF: "CHAT_OFF",
    CONTACT_ONOFF: "CONTACT_ONOFF"
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

export const setContactOnOff = (status) => {
    return {
        type: ActionType.CONTACT_ONOFF,
        status: status
    }
}