import User from "../../models/user.js"


const createNewUser = async (req, res) => {
    try {
        const reqPayload = req.body

        const data = await User.create(reqPayload)

        if(data)
            return res.status(201).json({code: 0, message: "success register new user", data: data})
        else
            return res.status(500).json({code: 1, message: "fail register new user", data: null})
    } catch (error) {
        return res.status(500).json({code: 1, message: error.message, data: null})
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


const truncateUser = async (req, res) => {
    try {
        await User.deleteMany({})

        res.status(200).json({code: 0, message: "success truncate user collection", data: null})
    } catch (error) {
        return res.status(500).json({code: 1, message: error.message, data: null})
    }
}


export { createNewUser, getAllUser, truncateUser }