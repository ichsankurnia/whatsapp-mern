const mongoose = require("mongoose")
const moment = require('moment')   


const contactSchema = mongoose.Schema({
    // as foreignKey relation to User Schema
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "c_users"
    },
    contact: {
        unique: true,
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
module.exports = mongoose.model('c_contacts', contactSchema)