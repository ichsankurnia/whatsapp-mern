// Importing
import express from "express";
import mongoose from "mongoose";
import Messages from "./dbMessages.js";
import Pusher from "pusher"
import cors from "cors";

// app config
const app = express()
const port = process.env.PORT || 9000

const pusher = new Pusher({
    appId: '1074553',
    key: '4495e494430a0c853b2a',
    secret: '216e53e2735a0b0f5704',
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
const dbName = 'whatsappdb'
const dbUser = 'ichsankurnia'
const dbPass = 'ichsan14'

const connection_url = `mongodb+srv://${dbUser}:${dbPass}@cluster0.ynrf1.mongodb.net/${dbName}?retryWrites=true&w=majority`

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