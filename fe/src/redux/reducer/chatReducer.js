import initialState from './intialState'
import { ActionTypeChat } from '../action/chatAction'

const chatReducer = (state = initialState.chat, action) => {
    // console.log(action)
    switch (action.type){
        case ActionTypeChat.SET_ROOM_CHAT:
            // console.log(action.data)
            return {
                ...state,
                room_chat: action.data
            }
        // case ActionTypeChat.SET_ROOM_CHAT_ID:
        //     const newRoomChat = { ...state.room_chat }
        //     newRoomChat['room_chat_id'] = action.id
        //     return {
        //         ...state,
        //         room_chat: newRoomChat
        //     }
        case ActionTypeChat.SET_ROOM_CHAT_ID:
            return {
                ...state,
                room_chat_id: action.id
            }
        // SET Wheter chat click from list conversation or from contact
        case ActionTypeChat.SET_FROM_CHAT:
            return {
                ...state,
                from_chat: action.status
            }
        // SET GROUP CHAT STATUS
        case ActionTypeChat.SET_GROUP_CHAT_STATUS:
            return {
                ...state,
                group_chat: action.status
            }
        // SET RECIPIENTS FROM A ROOM CHAT
        case ActionTypeChat.SET_RECIPIENST_CHAT:
            return {
                ...state,
                recipients_chat: action.recipients
            }
        default:
            return state
    }
}

export default chatReducer