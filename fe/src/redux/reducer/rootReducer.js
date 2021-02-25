import { combineReducers } from "redux";
import globalReducer from "./globalReducer";
import userReducer from "./userReducer";
import conversationReducer from "./conversationRedcuer";

const rootReducer = combineReducers({
    global: globalReducer,
    user: userReducer,
    conversation: conversationReducer
})

export default rootReducer

// Action => reducer => updateStore/state