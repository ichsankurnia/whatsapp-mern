import mongoose from "mongoose";
import moment from 'moment';   

const groupSchema = mongoose.Schema({
    group_id: {
        type: String,
        unique: true,
        required: [true, 'group id is required']
    },
    group_name: {
        type: String,
        // unique: true,
        required: [true, 'group name is required']
    },
    group_desc: {
        type: String,
    },
    group_photo: {
        type: String,
    },
    group_member: [{
        type: String,
        // unique: true,
        required: [true, 'phone number is required']
    }],
    group_maker: {
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
export default mongoose.model('c_groups', groupSchema)