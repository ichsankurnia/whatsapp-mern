export const ActionType = {
    CHAT_ON: "CHAT_ON",
    CHAT_OFF: "CHAT_OFF",
    CONTACT_ONOFF: "CONTACT_ONOFF",
    SET_USER_ID: "SET_USER_ID",
    SET_PHONE_NUMBER: "SET_PHONE_NUMBER",
    SET_CONTACT_LIST: "SET_CONTACT_LIST",
    SET_CONVERSATION_LIST: "SET_CONVERSATION_LIST",
    SET_ROOM_CHAT: "SET_ROOM_CHAT",
    SET_ROOM_CHAT_ID: "SET_ROOM_CHAT_ID",
    SET_FROM_CHAT: "SET_FROM_CHAT",
    SET_RECIPIENST_CHAT: "SET_RECIPIENST_CHAT",
    SET_GROUP_CHAT_STATUS: "SET_GROUP_CHAT_STATUS",
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

export const setRoomChatData = (data) => {
    return {
        type: ActionType.SET_ROOM_CHAT,
        data: data
    }
}

export const setRoomChatID = (conversationId) => {
    return {
        type: ActionType.SET_ROOM_CHAT_ID,
        id: conversationId
    }
}

export const setFromChat = (status) => {
    return {
        type: ActionType.SET_ROOM_CHAT,
        status
    }
}

export const setGroupChatStatus = (status) => {
    return {
        type: ActionType.SET_GROUP_CHAT_STATUS,
        status
    }
}

export const setRecipientsChat = (recipients) => {
    return {
        type: ActionType.SET_RECIPIENST_CHAT,
        recipients
    }
}