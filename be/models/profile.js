const mongoose = require("mongoose")
const moment = require('moment')   


const profileSchema = mongoose.Schema({
    // as foreignKey relation to User Schema
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "c_users"
    },
    fullname: {
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
module.exports = mongoose.model('c_profiles', profileSchema)