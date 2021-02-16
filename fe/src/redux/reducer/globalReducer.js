import initialState from './intialState'
import { ActionType } from '../action/actions'

const globalReducer = (state = initialState.global, action) => {
    console.log(action)
    switch (action.type){
        // Menampilkan isi chat saat mengclick room chat
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
        // Menyembunyikan list chat dan menampilkan list contact
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