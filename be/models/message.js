import mongoose from "mongoose";
import moment from 'moment';   


const messageSchema = mongoose.Schema({
    text: {
        type: String,
        default: ""
    },
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "c_users"
    },
    // as foreignKey relation to conversation Schema
    conversation_id: {
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
export default mongoose.model('c_messages', messageSchema)