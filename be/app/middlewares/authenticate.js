import jwt from "jsonwebtoken";
import User from "../../models/user.js";
import { encryptAes } from "../helper/encrypt.js";

import dotenv from "dotenv"
dotenv.config()


const login = async (req, res) => {
    try {
        const { username, password } = req.body
        const data = await User.findOne({ username: username })

        if(data){
            const dataByPass = await User.findOne({
                username: username,
                password: await encryptAes(password)
            })

            if(dataByPass){
                const token = jwt.sign({ 
                    username: data.username,
                    password: data.password,
                    email: data.email,
                }, process.env.JWT_KEY, { expiresIn: '1d' });
    
                return res.json({ code: 0, message: 'success authenticate', token: token, data: data });
            }else{
                return res.status(400).json({ code: 1, message: 'wrong password', data: null });
            }
        }else{
            return res.status(400).json({ code: 1, message: 'username not registered', data: null });
        }
    } catch (error) {
        return res.status(500).send({code:1, message: error.message, data: null})
    }
}

export default login