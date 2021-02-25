export const ActionTypeConversation = {
    SET_CONVERSATION_LIST: "SET_CONVERSATION_LIST",
    ADD_CONVERSATION: "ADD_CONVERSATION",
    ADD_MESSAGE_TO_CONVERSATION: "ADD_MESSAGE_TO_CONVERSATION",
}

export const setConversationList = (listConversation) => {
    return {
        type: ActionTypeConversation.SET_CONVERSATION_LIST,
        data: listConversation
    }
}

export const addConversation = (conversationId, recipients, newConversation) => {
    return {
        type: ActionTypeConversation.ADD_CONVERSATION,
        id: conversationId,
        recipients,
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