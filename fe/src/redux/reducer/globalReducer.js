import initialState from './intialState'
import { ActionType } from '../action/actions'

const globalReducer = (state = initialState.global, action) => {
    switch (action.type){
        case ActionType.CHAT_ON:
            return {
                ...state,
                chatOn: true || action.payload
            }
        case ActionType.CHAT_OFF:
            return {
                ...state,
                chatOn: false || action.payload
            }
        case ActionType.CONTACT_ONOFF:
            return {
                ...state,
                contactOn: action.status
            }
        default:
            return state
    }
}

export default globalReducer