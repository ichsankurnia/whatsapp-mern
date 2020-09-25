import express from "express";
import { 
    createNewUser, 
    getAllUser, 
    truncateUser 
} from "./app/controllers/controller-user.js";


const Router = express.Router();

Router.get('/', (req, res) => res.status(200).json({code: 0, message: "api running", author: "ichsankurnia"}))

Router.get('/user', getAllUser)
Router.post('/user', createNewUser)
Router.delete('/truncate-user', truncateUser)

export default Router