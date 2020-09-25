import express from "express";
import { 
    registerUser,
    createNewUser, 
    getAllUser, 
    getOneUser,
    updateUser,
    deleteUser,
    truncateUser 
} from "./app/controllers/controller-user.js";
import login from "./app/middlewares/authenticate.js"
import isAuthenticate from "./app/middlewares/verify-token.js"

const Router = express.Router();


Router.get('/', (req, res) => res.status(200).json({code: 0, message: "api running", author: "ichsankurnia"}))

Router.post('/user/sign-up', registerUser)
Router.post('/user/sign-in', login)

Router.get('/user', getAllUser)
Router.get('/user/:id', getOneUser)
Router.post('/user', createNewUser)
Router.put('/user/:id', updateUser)
Router.delete('/user/:id', deleteUser)
Router.delete('/truncate-user', truncateUser)

export default Router