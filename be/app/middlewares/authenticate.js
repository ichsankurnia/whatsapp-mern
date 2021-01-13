import jwt from "jsonwebtoken";
import User from "../../models/user.js";
import { encryptAes } from "../helper/encrypt.js";
import { idPhoneNumber } from "../helper/helper.js";

import dotenv from "dotenv"
dotenv.config()


const checkUserExist = async (user) => {
    try {
        const usn = await User.findOne({username: user})
        if(usn) return ['true', 'username']
        else{
            const mail = await User.findOne({email: user})
            if(mail) return ['true', 'email']
            else{
                const phone = await User.findOne({phone_number: idPhoneNumber(user)})
                if(phone) return ['true', 'phone_number']
                else return ['false']
            }
        }
    } catch (error) {
        return ['false']
    }
}

const login = async (req, res) => {
    try {
        const { user_mail_phone, password } = req.body
        const data = await checkUserExist(user_mail_phone)

        if(data[0] === 'true'){
            const payload = {
                password: await encryptAes(password)
            }

            if(data[1] === 'phone_number'){
                payload.phone_number = idPhoneNumber(user_mail_phone)
            }else{
                payload[data[1]] = user_mail_phone
            }

            const dataByPass = await User.findOne(payload)

            if(dataByPass){
                const token = jwt.sign({ 
                    phone_number: dataByPass.phone_number,
                    username: dataByPass.username,
                    password: dataByPass.password,
                    email: dataByPass.email,
                }, process.env.JWT_KEY, { expiresIn: '1d' });
    
                return res.json({ code: 0, message: 'success authenticate', token: token, data: dataByPass });
            }else{
                return res.status(400).json({ code: 1, message: 'wrong password', data: null });
            }
        }else{
            return res.status(400).json({ code: 1, message: 'user not registered', data: null });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({code:1, message: error.message, data: null})
    }
}

export default login