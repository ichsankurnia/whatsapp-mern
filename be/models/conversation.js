import mongoose from "mongoose";
import moment from 'moment';   


const conversationSchema = mongoose.Schema({
    message: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "c_messages"
    }],
    recipients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "c_users"
    }],
    // as foreignKey relation to User Schema
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "c_users"
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