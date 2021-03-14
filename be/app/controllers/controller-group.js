import mongoose from "mongoose";
import Group from "../../models/group.js";
import User from "../../models/user.js";
import { idPhoneNumber } from "../helper/helper.js";
import moment from 'moment';   


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

            if(!findUser) return res.status(400).json({code: 1, message: `group member with phone_number '${phoneNumber}' doesn't exist ☹️`, data: null})
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

        return res.status(201).json({code: 0, message: 'success create new group', data})
    } catch (error) {
        console.log(error)
        return res.status(400).json({code: 1, message: `${error.message} ☹️`, data: null})
    }
}


const deleteGroup = async (req, res) => {
    try {
        const { id } = req.params

        const ObjectId = mongoose.Types.ObjectId;
        const objId = new ObjectId( (id.length < 12) ? "123456789012" : id );

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


const getAllGroups = async (req, res) => {
    try {
        const data = await Group.find().populate([
            {
                path: "group_maker",
                select: ['phone_number'],
                model: "c_users",
            }
        ])

        if(data.length > 0) {
            return res.status(200).json({code: 0, message: 'success get all groups 😆', data})
        }else{
            return res.status(404).json({code: 1, message: "groups is doesn't exist ☹️", data: null})
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({code: 1, message: `${error.message} ☹️`, data: null})
    }
}


const getOneGroups = async (req, res) => {
    try {
        const { id } = req.params

        const ObjectId = mongoose.Types.ObjectId;
        const objId = new ObjectId( (id.length < 12) ? "123456789012" : id );

        const data = await Group.findOne({ 
            $or: [ { _id: objId }, { group_id: id }, ]
        }).populate([
            {
                path: "group_maker",
                select: ['phone_number'],
                model: "c_users",
            }
        ])

        if(data) {
            return res.status(200).json({code: 0, message: `success get group by id '${id}' 😆`, data})
        }else{
            return res.status(404).json({code: 1, message: `group with id '${id}' doesn't exist ☹️`, data: null})
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({code: 1, message: `${error.message} ☹️`, data: null})
    }
}


const getGroupsByUser = async (req, res) => {
    try {
        const { id } = req.params

        const ObjectId = mongoose.Types.ObjectId;
        const objId = new ObjectId( (id.length < 12) ? "123456789012" : id );

        const data = await User.findOne({ 
            $or: [ { _id: objId }, { phone_number: idPhoneNumber(id) }, ]
        }).select(['_id', 'username', 'phone_number', 'email']).populate([
            {
                path: "groups",
                // select: ['_id'],
                model: "c_groups",
                populate: {
                    path: 'group_maker',
                    select: ['phone_number'],
                    model: 'c_users'
                }
            }
        ])

        if(data) {
            return res.status(200).json({code: 0, message: `success get group by user id '${id}' 😆`, data})
        }else{
            return res.status(404).json({code: 1, message: `group with user id '${id}' doesn't exist ☹️`, data: null})
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({code: 1, message: `${error.message} ☹️`, data: null})
    }
}


const updateGroup = async (req, res) => {
    try {
        const { id } = req.params

        req.body.updated_at = moment(new Date()).format("dddd, DD-MM-YYYY hh:mm:ss A")

        const ObjectId = mongoose.Types.ObjectId;
        const objId = new ObjectId( (id.length < 12) ? "123456789012" : id );

        const data = await Group.findOneAndUpdate({ 
            $or: [ { _id: objId }, { group_id: id }, ]
        }, req.body)

        if(data) {
            const findGroupUpdated = await Group.findOne({ 
                $or: [ { _id: objId }, { group_id: id }, ]
            })
            
            return res.status(201).json({code: 0, message: `success update group by id '${id}' 😆`, data: findGroupUpdated})
        }else{
            return res.status(404).json({code: 1, message: `group with id '${id}' doesn't exist ☹️`, data: null})
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({code: 1, message: `${error.message} ☹️`, data: null})
    }
}


export {
    addNewGroup,
    deleteGroup,
    getAllGroups,
    getOneGroups,
    getGroupsByUser,
    updateGroup
}