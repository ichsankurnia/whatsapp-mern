export const ActionTypeChat = {
    SET_ROOM_CHAT: "SET_ROOM_CHAT",
    SET_ROOM_CHAT_ID: "SET_ROOM_CHAT_ID",
    SET_FROM_CHAT: "SET_FROM_CHAT",
    SET_RECIPIENST_CHAT: "SET_RECIPIENST_CHAT",
    SET_GROUP_CHAT_STATUS: "SET_GROUP_CHAT_STATUS",
}


export const setRoomChatData = (data) => {
    // console.log(data)
    return {
        type: ActionTypeChat.SET_ROOM_CHAT,
        data
    }
}

export const setRoomChatID = (conversationId) => {
    return {
        type: ActionTypeChat.SET_ROOM_CHAT_ID,
        id: conversationId
    }
}

export const setFromChat = (status) => {
    return {
        type: ActionTypeChat.SET_FROM_CHAT,
        status
    }
}

export const setGroupChatStatus = (status) => {
    return {
        type: ActionTypeChat.SET_GROUP_CHAT_STATUS,
        status
    }
}

export const setRecipientsChat = (recipients) => {
    return {
        type: ActionTypeChat.SET_RECIPIENST_CHAT,
        recipients
    }
}