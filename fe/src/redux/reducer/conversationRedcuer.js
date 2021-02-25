import { ActionTypeConversation } from '../action/conversationAction'
import initialState from './intialState'

const conversationReducer = (state = initialState.conversations, action) => {
    // console.log(action)
    switch (action.type){
        case ActionTypeConversation.ADD_CONVERSATION:
            // const newConversation = {
            //     conversationId : action.id,
            //     recipients : action.recipients,
            //     message: []
            // }
            // const conversations = [...state, newConversation]
            // return conversations
            return action.new_conversation
        case ActionTypeConversation.ADD_MESSAGE_TO_CONVERSATION:
            console.log(action.id)
            const indexConversation = state.findIndex((obj => obj.conversation_id === action.id))
            const conversations = [ ...state ]
            conversations[indexConversation].messages = [...conversations[indexConversation].messages, action.newMessage]
            return conversations
        default:
            return state
    }
}

export default conversationReducer