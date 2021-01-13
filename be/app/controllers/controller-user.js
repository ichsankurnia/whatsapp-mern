import User from "../../models/user.js"
import Profile from "../../models/profile.js"
import Contact from "../../models/contact.js";
import moment from 'moment';   
import { encryptAes } from "../helper/encrypt.js";
import { idPhoneNumber } from "../helper/helper.js";


const registerUser = async (req, res) => {
    try {
        const { username, password, email, phone_number } = req.body
        
        const data = await User.create({
            phone_number: idPhoneNumber(phone_number),
            username: username,
            password: await encryptAes(password),
            email: email
        })

        if(data){
            const profile = await Profile.create({user_id: data._id})
            if(profile){
                const updateUser = await User.findByIdAndUpdate(data._id, { profile_id : profile._id })
                if(updateUser){
                    return res.status(201).json({code: 0, message: "succes register new user", data: updateUser})
                }else{
                    return res.status(500).json({code: 1, message: "fail register new user", data: null})
                }
            }else{
                return res.status(500).json({code: 1, message: "fail register new user", data: null})
            }
        }else{
            return res.status(500).json({code: 1, message: "fail register new user", data: null})
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({code: 1, message: error.message, data: null})
    }
}


const createNewUser = async (req, res) => {
    try {
        const reqPayload = req.body

        if(req.body.password){
            req.body.password = await encryptAes(req.body.password)
        }

        const data = await User.create(reqPayload)

        if(data){
            const profile = await Profile.create({user_id: data._id})
            if(profile){
                const updateUser = await User.findByIdAndUpdate(data._id, { profile_id : profile._id })
                if(updateUser){
                    return res.status(201).json({code: 0, message: "success register", data: updateUser})
                }else{
                    return res.status(500).json({code: 1, message: "failed register", data: null})
                }
            }else{
                return res.status(500).json({code: 1, message: "failed register new user", data: null})
            }
        }else{
            return res.status(500).json({code: 1, message: "failed register new user", data: null})
        }
    } catch (error) {
        return res.status(400).json({code: 1, message: error.message, data: null})
    }
}


const getAllUser = async (req, res) => {
    try {
        const data = await User.find()

        if(data.length > 0){
            res.status(200).send({code: 0, message: "success get all user", data: data})
        }else{
            res.status(500).send({code: 1, message: "data doesn't exist", data: data})
        }
    } catch (error) {
        return res.status(500).json({code: 1, message: error.message, data: null})
    }
}


const getOneUser = async (req, res) => {
    try {
        const { id } = req.params
        const data = await User.findById(id).select(['_id', 'username', 'password', 'email', 'phone_number']).populate([
            {
                path: "profile_id",
                select: ['fullname', 'photo', 'about'],
                model: "c_profiles"
            },
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
                        select: ['fullname'],
                        model: 'c_profiles'
                    }
                }
            }
        ])

        if(data){
            res.status(200).send({code: 0, message: "success get user by id", data: data})
        }else{
            res.status(400).send({code: 1, message: `data with id '${id}' doesn't exist`, data: data})
        }
    } catch (error) {
        return res.status(400).json({code: 1, message: error.message, data: null})
    }
}


const updateUser = async (req, res) => {
    try {
        const { id } = req.params
        
        if(req.body.password){
            req.body.password = await encryptAes(req.body.password)
        }

        if(req.body.phone_number){
            req.body.phone_number = idPhoneNumber(req.body.phone_number)
        }
        
        req.body.updated_at = moment(new Date()).format("dddd, DD-MM-YYYY hh:mm:ss A")

        // const data = await User.findOneAndUpdate({ _id: req.params.id }, req.body)
        const data = await User.findByIdAndUpdate(id, req.body)

        if(data){
            const updateData = await User.findById(id)
            
            return res.status(202).json({code: 0, message: "success update user", data: updateData})
        }else{
            return res.status(400).json({code: 1, message: `fail update user, data with id '${id}' doesn't exist`, data: null})
        }
    } catch (error) {
        return res.status(400).json({code: 1, message: error.message, data: null})
    }
}


const deleteUser = async (req, res) => {
    try {
        const { id } = req.params

        const data = await User.findByIdAndRemove(id)

        if(data){
            await Profile.findOneAndDelete({ user_id: id })
            await Contact.findOneAndDelete({ owner : id })

            return res.status(200).json({code: 0, message: "success delete user", data: data})
        }else{
            return res.status(400).json({code: 1, message: `fail delete user, data with id '${id}' doesn't exist`, data: null})
        }
    } catch (error) {
        return res.status(400).json({code: 1, message: error.message, data: null})
    }
}


const truncateUser = async (req, res) => {
    try {
        await User.deleteMany({})
        await Profile.deleteMany({})
        await Contact.deleteMany({})

        res.status(200).json({code: 0, message: "success truncate user collection", data: null})
    } catch (error) {
        return res.status(500).json({code: 1, message: error.message, data: null})
    }
}


const getProfile = async (req, res) => {
    try {
        const { profile_id } = req.params

        const data = await Profile.findById(profile_id)

        if(data){
            return res.status(200).json({code: 0, message: `success get profile id ${profile_id}`, data: data})
        }else{
            return res.status(500).json({code: 1, message: `profile id ${profile_id} not found ☹️`, data: null})
        }
    } catch (error) {
        return res.status(400).json({code: 1, message: error.message, data: null})
    }
}

const updateProfile = async (req, res) => {
    try {
        const { profile_id } = req.params
        
        req.body.updated_at = moment(new Date()).format("dddd, DD-MM-YYYY hh:mm:ss A")

        const data = await Profile.findOneAndUpdate({ _id: profile_id }, req.body)
        
        if(data){
            const updateData = await Profile.findOne({ _id: profile_id })

            return res.status(200).json({code: 0, message: "success update user profile", data: updateData})
        }else{
            return res.status(400).json({code: 1, message: `fail update user profile, user with id '${profile_id}' doesn't exist ☹️`, data: null})
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({code: 1, message: error.message, data: null})
    }
}


export { 
    registerUser, 
    createNewUser, 
    getAllUser, 
    getOneUser, 
    updateUser, 
    deleteUser,
    truncateUser,
    getProfile,
    updateProfile 
}