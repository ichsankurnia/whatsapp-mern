import { combineReducers } from "redux";
import globalReducer from "./globalReducer";
import userReducer from "./userReducer";
import conversationReducer from "./conversationRedcuer";
import chatReducer from "./chatReducer";

const rootReducer = combineReducers({
    global: globalReducer,
    user: userReducer,
    conversation: conversationReducer,
    chat: chatReducer,
})

export default rootReducer

// Action => reducer => updateStore/state