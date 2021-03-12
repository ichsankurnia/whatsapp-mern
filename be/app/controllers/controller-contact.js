import Contact from "../../models/contact.js";
import User from "../../models/user.js";
import { idPhoneNumber } from "../helper/helper.js";


const addContact = async (req, res) => {
    try {
        const { user_id, new_contact } = req.body
        
        var findOwner = await User.findOne({phone_number: idPhoneNumber(user_id)})
        
        if(!findOwner) {
            findOwner = await User.findOne({_id: user_id})
            if(!findOwner) return res.status(400).json({code: 1, message: `owner with _id or phone number '${user_id}' not found ☹️`, data: null})
        }
        
        if(findOwner.phone_number === idPhoneNumber(new_contact)) return res.status(400).json({code: 1, message: `you can't add yourself as a contact lol 😝`, data: null})
        
        console.log(findOwner)
        
        var findContact = await User.findOne({phone_number: idPhoneNumber(new_contact)})
        
        if(!findContact){
            findContact = await User.findOne({_id: new_contact})
            if(!findContact) return res.status(400).json({code: 1, message: `the new contact with _id or phone number '${new_contact}' not found ☹️`, data: null})
        }


        console.log(findContact)

        const data = await Contact.create({
            user_id: findOwner._id,
            contact: findContact._id
        })

        if(data){
            // jika contact berhasil ditambahkan, update collection user pada column/document contact
            const addContactToUser = await User.findByIdAndUpdate(
                                        data.user_id,
                                        { 
                                            $push: { contacts: data._id } 
                                        },
                                        { 
                                            new: true, useFindAndModify: false 
                                        }
                                    )
            if(addContactToUser){
                const findContact = await User.findOne({_id: user_id}).select(['_id']).populate([
                    {
                        path: "contacts",
                        select: ['contact'],
                        model: "c_contacts",
                        populate: {
                            path: 'contact',
                            select: ['username', 'email', 'phone_number'],
                            model: 'c_users',
                            populate: {
                                path: 'profile_id',
                                select: ['fullname', 'photo', 'about'],
                                model: 'c_profiles'
                            }
                        }
                    }
                ])

                return res.status(201).json({code: 0, message: `success add contact to user id '${user_id}' 😆`, data: findContact})
            }
        }else{
            return res.status(400).json({code: 1, message: `fail add contact to user id '${user_id}' ☹️`, data: null})
        }
    } catch (error) {
        console.log(error.message)
        return res.status(400).json({code: 1, message: `${error.message} 😝`, data: null})
    }
}


const getContactbyUserId = async (req, res) => {
    try {
        const { user_id } = req.params

        // const findContact = await Contact.find({user_id: user_id}).populate([
        //     {
        //         path: 'user_id',
        //         select: ['username', 'email'],
        //         model: 'c_users',
        //         populate: {
        //             path: 'profile',
        //             select: ['fullname', 'phone_number'],
        //             model: 'c_profiles'
        //         }
        //     },
        //     {
        //         path: 'contact',
        //         select: ['username', 'email'],
        //         model: 'c_users',
        //         populate: {
        //             path: 'profile',
        //             select: ['fullname', 'phone_number'],
        //             model: 'c_profiles'
        //         }
        //     }
        // ])

        const findContact = await User.findOne({_id: user_id}).select(['_id']).populate([
            {
                path: "contacts",
                select: ['contact'],
                model: "c_contacts",
                populate: {
                    path: 'contact',
                    select: ['username', 'email', 'phone_number'],
                    model: 'c_users',
                    populate: {
                        path: 'profile_id',
                        select: ['fullname', 'photo', 'about'],
                        model: 'c_profiles'
                    }
                }
            }
        ])

        if(findContact){
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