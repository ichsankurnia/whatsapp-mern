import Message from "../../models/message.js";
import User from "../../models/user.js";


const newMessage = async (req, res) => {
    try {
        const {message, sender_id, receiver_id} = req.body 
        
        const data = await Message.create(req.body)

        if(data){
            await User.findByIdAndUpdate(
                { _id: sender_id },
                {
                    $push: {messages: data._id}
                },
                {
                    new: true, useFindAndModify: false
                }
            )

            return res.status(201).json({code: 0, message: 'message sent 😆', data: data})
        }else{
            return res.status(500).json({code: 1, message: 'send message failed ☹️', data: null})
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({code: 1, message: `${error.message} ☹️`, data: null})
    }
}


const getAllMessage = async (req, res) => {
    try {
        const data = await Message.find()
        
        if(data.length > 0){
            return res.status(200).json({code: 0, message: "success get all message 😆", data: data})
        }else{
            return res.status(400).json({code: 1, message: 'fail get all message ☹️', data: null})
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({code: 1, message: `${error.message} ☹️`, data: null})
    }
}


const getMsgBySenderAndReceiver = async (req, res) => {
    try {
        const {sender_id, receiver_id} = req.body 

        const data = await Message.find({sender_id: sender_id, receiver_id: receiver_id})
        
        if(data.length > 0){
            return res.status(200).json({code: 0, message: "success get message by sender_id & receiver_id 😆", data: data})
        }else{
            return res.status(200).json({code: 1, message: `messages to user id '${receiver_id}' doesn't exist ☹️`, data: null})
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({code: 1, message: `${error.message} ☹️`, data: null})
    }
}


const getMsgBySenderOrReceiver = async (req, res) => {
    try {
        const {sender_id, receiver_id} = req.body 

        const data = await Message.find({
            $or: [{ sender_id: sender_id }, { receiver_id: receiver_id }]
        })
        
        if(data.length > 0){
            return res.status(200).json({code: 0, message: "success get message by sender_id & receiver_id 😆", data: data})
        }else{
            return res.status(200).json({code: 1, message: `you dont have any message ☹️`, data: null})
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({code: 1, message: `${error.message} ☹️`, data: null})
    }
}


const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params

        const data = await Message.findOneAndDelete({_id: id})

        if(data){
            return res.status(200).json({code: 0, message: 'success delete message 😆', data: data})
        }else{
            return res.status(500).json({code: 1, message: 'fail delete message ☹️', data: null})
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({code: 1, message: `${error.message} ☹️`, data: null})
    }
}


export {
    newMessage,
    getAllMessage,
    getMsgBySenderAndReceiver,
    getMsgBySenderOrReceiver,
    deleteMessage
}