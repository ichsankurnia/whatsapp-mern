import Contact from "../../models/contact.js";
import User from "../../models/user.js";


const addContact = async (req, res) => {
    try {
        const { user_id, contact } = req.body
        
        const findOwner = await User.findOne({_id: user_id})
        const findContact = await User.findOne({_id: contact})
        
        if(!findOwner) return res.status(400).json({code: 1, message: `owner with user id '${user_id}' not found ☹️`, data: null})
        if(!findContact) return res.status(400).json({code: 1, message: `contact with user id '${contact}' not found ☹️`, data: null})
        
        if(user_id === contact) return res.status(400).json({code: 1, message: `you cant't add yourself as a contact lol 😝`, data: null})
        
        const data = await Contact.create(req.body)

        if(data){
            // jika contact berhasil ditambahkan, update collection user pada column/document contact
            await User.findByIdAndUpdate(
                data.user_id,
                { 
                    $push: { contacts: data._id } 
                },
                { 
                    new: true, useFindAndModify: false 
                }
            )

            return res.status(201).json({code: 0, message: `success add contact to user id '${user_id}' 😆`, data: data})
        }else{
            return res.status(400).json({code: 1, message: `fail add contact to user id '${user_id}' ☹️`, data: null})
        }

    } catch (error) {
        return res.status(400).json({code: 1, message: `${error.message} ☹️`, data: null})
    }
}


const getContactbyUserId = async (req, res) => {
    try {
        const { user_id } = req.params

        const findContact = await Contact.find({user_id: user_id}).populate([
            {
                path: 'user_id',
                select: ['username', 'email'],
                model: 'c_users',
                populate: {
                    path: 'profile',
                    select: ['fullname', 'phone_number'],
                    model: 'c_profiles'
                }
            },
            {
                path: 'contact',
                select: ['username', 'email'],
                model: 'c_users',
                populate: {
                    path: 'profile',
                    select: ['fullname', 'phone_number'],
                    model: 'c_profiles'
                }
            }
        ])

        if(findContact.length > 0){
            return res.status(201).json({code: 0, message: `success get contact user id '${user_id}' 😆`, data: findContact})
        }else{
            return res.status(400).json({code: 1, message: `the contact of user id '${user_id}' doesn't exist ☹️`, data: null})
        }
    } catch (error) {
        return res.status(400).json({code: 1, message: `${error.message} ☹️`, data: null})
    }
}


const deleteContact = async (req, res) => {
    try {
        const { user_id, contact } = req.body

        const data = await Contact.findOneAndDelete({user_id: user_id, contact: contact})      

        if(data){
            await User.updateOne(
                { _id: user_id },
                {
                    $pull : { contacts: data._id }
                }
            )

            return res.status(201).json({code: 0, message: `success delete contact '${contact}' with owner '${user_id}' 😆`, data: data})
        }else{
            return res.status(400).json({code: 1, message: `fail delete contact, contact '${contact}' with owner '${user_id}' doesn't exist ☹️`, data: null})
        }
    } catch (error) {
        return res.status(400).json({code: 1, message: `${error.message} ☹️`, data: null})
    }
}


export {
    addContact,
    getContactbyUserId,
    deleteContact
}