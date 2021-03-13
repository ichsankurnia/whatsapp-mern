import mongoose from "mongoose";
import Group from "../../models/group.js";
import User from "../../models/user.js";
import { idPhoneNumber } from "../helper/helper.js";

function checkIfDuplicateExists(w){
    return new Set(w).size !== w.length 
}

const addNewGroup = async (req, res) => {
    try {
        const { group_member } = req.body

        if(group_member.length === 0) return res.status(400).json({code: 1, message: `group member is empty ☹️`, data: null})
        
        if(checkIfDuplicateExists(group_member)) return res.status(400).json({code: 1, message: `group member contains duplicate number ☹️`, data: null})

        // Check wheter phone number is existed
        await Promise.all(group_member.map(async (phoneNumber) => {
            const findUser = await User.findOne({phone_number: idPhoneNumber(phoneNumber)})

            if(!findUser) return res.status(400).json({code: 1, message: `group member with phone_number ${phoneNumber} doesn't exist ☹️`, data: null})
        }))
        
        // // Create group
        const data = await Group.create(req.body)

        if(data){
            await Promise.all(group_member.map(async (phoneNumber) => {
                await User.findOneAndUpdate(
                    {
                        phone_number: idPhoneNumber(phoneNumber)
                    },
                    { 
                        $push: { groups: data._id } 
                    },
                    { 
                        new: true, useFindAndModify: false 
                    }
                )
            })) 
        }else{
            return res.status(500).json({code: 1, message: `failed create a new groups ☹️`, data: null})
        }

        return res.status(200).json({code: 0, message: 'success', data})
    } catch (error) {
        console.log(error)
        return res.status(400).json({code: 1, message: `${error.message} ☹️`, data: null})
    }
}


const deleteGroup = async (req, res) => {
    try {
        const { id } = req.params

        var ObjectId = mongoose.Types.ObjectId;
        var objId = new ObjectId( (id.length < 12) ? "123456789012" : id );

        const findGroup = await Group.findOne({ 
            $or: [ { _id: objId }, { group_id: id }, ]
        })

        if(!findGroup) return res.status(400).json({code: 1, message: `failed delete group, group with id '${id} doesn't exist ☹️`, data: null})

        const deleteGroup = await Group.findOneAndDelete(
            { $or:
                [ { _id: objId }, { group_id: id } ]
            }
        )

        if(deleteGroup) {
            await Promise.all(findGroup.group_member.map(async (phoneNumber) => {
                await User.updateOne(
                    {
                        phone_number: idPhoneNumber(phoneNumber)
                    },
                    {
                        $pull : { groups: deleteGroup._id }
                    }
                )
            }))
        }else{
            return res.status(500).json({code: 1, message: `delete group failed ☹️`, data: null})
        }

        return res.status(200).json({code: 0, message: 'success delete group', data: deleteGroup})
    } catch (error) {
        console.log(error)
        return res.status(400).json({code: 1, message: `${error.message} ☹️`, data: null})
    }
}


export {
    addNewGroup,
    deleteGroup
}