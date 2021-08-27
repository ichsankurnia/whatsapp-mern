export const ActionTypeConversation = {
    SET_CONVERSATION_LIST: "SET_CONVERSATION_LIST",
    ADD_CONVERSATION: "ADD_CONVERSATION",
    ADD_MESSAGE_TO_CONVERSATION: "ADD_MESSAGE_TO_CONVERSATION",
    UPDATE_CONVERSATION_ID: "UPDATE_CONVERSATION_ID"
}

export const setConversationList = (listConversation) => {
    return {
        type: ActionTypeConversation.SET_CONVERSATION_LIST,
        data: listConversation
    }
}

export const addConversation = (newConversation) => {
    return {
        type: ActionTypeConversation.ADD_CONVERSATION,
        new_conversation: newConversation
    }
}

export const addMessageToConversation = (conversationId, message) => {
    return {
        type: ActionTypeConversation.ADD_MESSAGE_TO_CONVERSATION,
        id: conversationId,
        newMessage: message
    }
}

export const updateConversationID = (newConvID, recipients, message) => {
    return {
        type: ActionTypeConversation.UPDATE_CONVERSATION_ID,
        recipients,
        new_id: newConvID,
        new_msg: message
    }
}