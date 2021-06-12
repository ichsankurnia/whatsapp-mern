const express = require('express')
const { 
    registerUser,
    createNewUser, 
    getAllUser, 
    getOneUser,
    updateUser,
    deleteUser,
    truncateUser ,
    updateProfile,
    getProfile,
    getDetailUser
} = require("./app/controllers/controller-user")
const login = require("./app/middlewares/authenticate")
const isAuthenticate = require("./app/middlewares/verify-token.js")
const { 
    addContact, 
    getContactbyUserId, 
    deleteContact 
} = require("./app/controllers/controller-contact")
const { 
    deleteMessage, 
    getAllMessage, 
    getMsgBySenderAndReceiver, 
    getMsgBySenderOrReceiver, 
    newMessage 
} = require("./app/controllers/controller-message")
const { 
    addNewGroup, 
    deleteGroup, 
    getAllGroups, 
    getGroupsByUser, 
    getOneGroups, 
    addGroupMember,
    removeGroupMember, 
    updateGroup 
} = require ("./app/controllers/controller-group.js")


const Router = express.Router();

Router.get('/', (req, res) => res.status(200).json({ author: 'Ichsan Kurniawan 😎', contact: 'kurniaichsan45@gmail.com', description: 'API Social Media chat application with NodeJS ExpressJS Pusher and MongoDB 🚀🚀🚀'}))

// Authentication
Router.post('/user/sign-up', registerUser)
Router.post('/user/sign-in', login)

// User
Router.get('/user', getAllUser)
Router.get('/user-detail/:id', getDetailUser)
Router.get('/user/:id', getOneUser)
Router.post('/user', createNewUser)
Router.patch('/user/:id', updateUser)
Router.delete('/user/:id', deleteUser)
Router.delete('/truncate-user', truncateUser)

// Profile
Router.get('/user/profile/:profile_id', getProfile)
Router.patch('/user/profile/:profile_id', updateProfile)


// Contact
Router.get('/contact/:user_id', getContactbyUserId)
Router.post('/contact', addContact)
Router.delete('/contact', deleteContact)


// Group
Router.post('/group', addNewGroup)
Router.get('/group', getAllGroups)
Router.get('/group/:id', getOneGroups)
Router.get('/group-user/:id', getGroupsByUser)
Router.post('/group-new-member', addGroupMember)
Router.post('/group-remove-member', removeGroupMember)
Router.patch('/group/:id', updateGroup)
Router.delete('/group/:id', deleteGroup)


// Message
Router.post('/message/new', newMessage)
Router.get('/message/sync-all', getAllMessage)
Router.post('/message/sender-and-receiver', getMsgBySenderAndReceiver)
Router.post('/message/sender-or-receiver', getMsgBySenderOrReceiver)
Router.delete('/message/delete/:id', deleteMessage)


module.exports = Router