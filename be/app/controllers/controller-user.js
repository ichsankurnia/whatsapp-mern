import User from "../../models/user.js"
import moment from 'moment';   
import { encryptAes } from "../helper/encrypt.js";


const registerUser = async (req, res) => {
    try {
        const { username, password, email } = req.body
        
        const data = await User.create({
            username: username,
            password: await encryptAes(password),
            email: email
        })

        if(data){
            return res.status(201).json({code: 0, message: "succes register new user", data: data})
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

        const data = await User.create(reqPayload)

        if(data)
            return res.status(201).json({code: 0, message: "success add new user", data: data})
        else
            return res.status(500).json({code: 1, message: "fail register new user", data: null})
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
        const data = await User.findById(id)

        console.log(data)
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

        req.body.updated_at = moment(new Date()).format("dddd, DD-MM-YYYY hh:mm:ss A")
        // const data = await User.findOneAndUpdate({ _id: req.params.id }, req.body)
        const data = await User.findByIdAndUpdate(id, (req.body))

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

        console.log(data)
        if(data){
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

        res.status(200).json({code: 0, message: "success truncate user collection", data: null})
    } catch (error) {
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
    truncateUser 
}