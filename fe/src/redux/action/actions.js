export const ActionType = {
    CHAT_ON: "CHAT_ON",
    CHAT_OFF: "CHAT_OFF",
    CONTACT_ONOFF: "CONTACT_ONOFF",
    SET_USER_ID: "SET_USER_ID",
    SET_PHONE_NUMBER: "SET_PHONE_NUMBER",
    SET_CONTACT_LIST: "SET_CONTACT_LIST",
    SET_CONVERSATION_LIST: "SET_CONVERSATION_LIST",
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

export const setContactList = (listContact) => {
    return {
        type: ActionType.SET_CONTACT_LIST,
        data: listContact
    }
}

export const setConversationList = (listConversation) => {
    return {
        type: ActionType.SET_CONVERSATION_LIST,
        data: listConversation
    }
} 