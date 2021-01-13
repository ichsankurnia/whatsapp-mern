import mongoose from "mongoose";
import moment from 'moment';   


const userSchema = mongoose.Schema({
    phone_number: {
        type: String,
        unique: true,
        required: [true, 'phone number is required']
    },
    username: {
        type: String,
        unique: true,
        required: [true, 'username is required']
    },
    password: {
        type: String,
        required: [true, 'password is required']
    },
    email: {
        type: String,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        default: "",
    },
    profile_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "c_profiles"
    },
    contacts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "c_contacts"
    }],
    conversations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "c_conversations"
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "c_messages"
    }],
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
export default mongoose.model('c_users', userSchema)