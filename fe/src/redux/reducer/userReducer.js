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
        case ActionType.SET_GROUP_LIST:
            return {
                ...state,
                group_list: action.data
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
        default:
            return state
    }
}

export default userReducer