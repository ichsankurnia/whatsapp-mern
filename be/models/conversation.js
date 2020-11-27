import mongoose from "mongoose";
import moment from 'moment';   


const conversationSchema = mongoose.Schema({
    message: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "c_messages"
    }],
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "c_users"
    },
    receiver: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "c_users"
    }],
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "c_conversations"
    },
    created_at: {
        type: String,
        default: moment(new Date()).format("dddd, DD-MM-YYYY hh:mm:ss A") 
    },
    updated_at: { 
        type: String, 
        default: moment(new Date()).format("dddd, DD-MM-YYYY hh:mm:ss A") 
    }
})


// Collection
export default mongoose.model('c_conversations', conversationSchema)