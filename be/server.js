// Importing
import express from "express";
import mongoose from "mongoose";
import Messages from "./dbMessages.js";
import Pusher from "pusher"
import cors from "cors";
import dotenv from "dotenv"


// app config
dotenv.config()
const app = express()
const port = process.env.PORT || 9000

const { PUSHER_ID, PUSHER_KEY, PUSHER_SECRET } = process.env
const pusher = new Pusher({
    appId: PUSHER_ID,
    key: PUSHER_KEY,
    secret: PUSHER_SECRET,
    cluster: 'ap1',
    encrypted: true
});


// middleware
app.use(express.json())

app.use(cors())
// app.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader("Access-Control-Allow-Headers", "*")
//     next();
// })


// DB config
const { DB_NAME, DB_USER, DB_PASS } = process.env

const connection_url = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.ynrf1.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`

const mongooOption = {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}

mongoose.connect(connection_url, mongooOption, (err) => {
    console.log(err)
})


const db = mongoose.connection

db.once("open", () => {
    console.log("DB connected")

    const msgCollection = db.collection("messagecontents")
    const changeStream = msgCollection.watch()
    
    changeStream.on("change", (change) => {
        console.log(change)

        if(change.operationType === "insert"){
            const { message, name, timestamp, received } = change.fullDocument
            pusher.trigger("messages", "inserted", {
                message: message,
                name: name,
                timestamp: timestamp,
                received: received
            })
        }else{
            console.log("operation type not inserted")
        }
    })
})


// ????


// api routes
app.get("/", (req, res) => res.status(200).send("whatsapp-mern backend service"))

app.get("/messages/sync", async (req, res) => {
    try {
        const data = await Messages.find()

        if(data.length > 0){
            res.status(200).send(data)
        }else{
            res.status(500).send("data doesn't exist")
        }
    } catch (error) {
        return res.status(500).send(error)
    }
})

app.post("/messages/new", async (req, res) => {
    try {
        const dbMessages = req.body
        const data = await Messages.create(dbMessages)

        if(data){
            res.status(201).send(data)
        }else{
            res.status(400).send("failed")
        }
    } catch (error) {
        res.status(500).send(error)
    }
})


// listen
app.listen(port, () => {
    console.log(`Listening on localhost:${port}`)
})