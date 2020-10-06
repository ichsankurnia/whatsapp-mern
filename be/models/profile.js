import mongoose from "mongoose";
import moment from 'moment';   


const profileSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "c_users"
    },
    fullname: {
        type: String,
        default: ""
    },
    phone_number: {
        type: String,
        default: ""
    },
    photo: {
        type: String,
        default: ""
    },
    about: {
        type: String,
        default: "Hey there! I am using new Sosmed chat application by ichsankurnia"
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
export default mongoose.model('c_profiles', profileSchema)