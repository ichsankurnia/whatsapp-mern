import express from "express";
import { 
    registerUser,
    createNewUser, 
    getAllUser, 
    getOneUser,
    updateUser,
    deleteUser,
    truncateUser ,
    updateProfile
} from "./app/controllers/controller-user.js";
import login from "./app/middlewares/authenticate.js"
import isAuthenticate from "./app/middlewares/verify-token.js"
import { 
    addContact, 
    getContactbyUserId, 
    deleteContact 
} from "./app/controllers/controller-contact.js";


const Router = express.Router();

Router.get('/', (req, res) => res.status(200).json({ author: 'Ichsan Kurniawan 😎', contact: 'kurniaichsan45@gmail.com', description: 'API Social Media chat application with NodeJS ExpressJS Pusher and MongoDB 🚀🚀🚀'}))

// Authentication
Router.post('/user/sign-up', registerUser)
Router.post('/user/sign-in', login)

// User
Router.get('/user', getAllUser)
Router.get('/user/:id', getOneUser)
Router.post('/user', createNewUser)
Router.patch('/user/:id', updateUser)
Router.delete('/user/:id', deleteUser)
Router.delete('/truncate-user', truncateUser)

// Profile
Router.patch('/user/profile/:user_id', updateProfile)


// Contact
Router.get('/contact/:user_id', getContactbyUserId)
Router.post('/contact', addContact)
Router.delete('/contact', deleteContact)



export default Router