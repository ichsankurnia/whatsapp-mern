import initialState from './intialState'
import { ActionType } from '../action/actions'

const userReducer = (state = initialState.user, action) => {
    // console.log(action)
    switch (action.type){
        case ActionType.SET_CONTACT_LIST:
            return {
                ...state,
                contact_list: action.data
            }
        case ActionType.SET_CONVERSATION_LIST:
            return {
                ...state,
                conversation_list: action.data
            }
        case ActionType.SET_USER_ID:
            return {
                ...state,
                user_id: action.id
            }
        case ActionType.SET_PHONE_NUMBER:
            return {
                ...state,
                phone_number: action.phone_number
            }
        case ActionType.SET_ROOM_CHAT:
            return {
                ...state,
                room_chat: action.data
            }
        case ActionType.SET_ROOM_CHAT_ID:
            const newRoomChat = { ...state.room_chat }
            newRoomChat['room_chat_id'] = action.id
            return {
                ...state,
                room_chat: newRoomChat
            }
        // SET Wheter chat click from list conversation or from contact
        case ActionType.SET_FROM_CHAT:
            return {
                ...state,
                from_chat: action.status
            }
        // SET GROUP CHAT STATUS
        case ActionType.SET_GROUP_CHAT_STATUS:
            return {
                ...state,
                group_chat: action.status
            }
        // SET RECIPIENTS FROM A ROOM CHAT
        case ActionType.SET_RECIPIENST_CHAT:
            return {
                ...state,
                recipients_chat: action.recipients
            }
        default:
            return state
    }
}

export default userReducer