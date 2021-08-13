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
            const indexConversation = state.findIndex((obj => obj.conversation_id === action.id))
            const conversations = [ ...state ]
            conversations[indexConversation].messages = [...conversations[indexConversation].messages, action.newMessage]
            return conversations
        case ActionTypeConversation.UPDATE_CONVERSATION_ID:
            const iConv = state.findIndex(conv => conv.recipients.length === 1 && conv.recipients[0] === action.recipients[0])              // find index old conversation
            const listConv = [...state]
            listConv[iConv].conversation_id = action.new_id
            listConv[iConv].messages = [...listConv[iConv].messages, action.new_msg]
            return listConv
        default:
            return state
    }
}

export default conversationReducer