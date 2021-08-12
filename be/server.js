// Importing
import express from "express";
import mongoose from "mongoose";
import Pusher from "pusher"
import cors from "cors";
import dotenv from "dotenv"
import moment from 'moment';
import "moment-timezone"

import Messages from "./dbMessages.js";
import route from "./routes.js";
import GlobalVariable from "./app/helper/globalVariable.js";
import { addGroupWithSocket } from "./app/controllers/controller-group.js";


import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// app config
const app = express()
const port = process.env.PORT || 9000
dotenv.config()

var server = require('http').createServer(app);
var io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});

let variable = new GlobalVariable()

const { PUSHER_ID, PUSHER_KEY, PUSHER_SECRET } = process.env
const pusher = new Pusher({
    appId: PUSHER_ID,
    key: PUSHER_KEY,
    secret: PUSHER_SECRET,
    cluster: 'ap1',
    encrypted: true
});

moment.tz.setDefault("Asia/Jakarta");


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
console.log("DB AUTH :", DB_NAME, DB_USER, DB_PASS)
// const connection_url = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.ynrf1.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`
// const connection_url = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.ynrf1.mongodb.net/${DB_NAME}?authSource=admin&compressors=zlib&retryWrites=true&w=majority&ssl=true`
const connection_url = `mongodb://${DB_USER}:${DB_PASS}@cluster0-shard-00-00.ynrf1.mongodb.net:27017,cluster0-shard-00-01.ynrf1.mongodb.net:27017,cluster0-shard-00-02.ynrf1.mongodb.net:27017/${DB_NAME}?ssl=true&replicaSet=atlas-12isqv-shard-0&authSource=admin&retryWrites=true&w=majority`

const mongooOption = {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}

mongoose.connect(connection_url, mongooOption, (err) => {
    console.log(err)
})

mongoose.connection.on('open', function (ref) {
    console.log('Connected to mongo server.');
});
mongoose.connection.on('error', function (err) {
    console.log('Could not connect to mongo server!');
    console.log(err);
});


const db = mongoose.connection

db.once("open", () => {
    console.log("DB connected")

    const msgCollection = db.collection("messagecontents")
    const changeStream = msgCollection.watch()
    
    changeStream.on("change", (change) => {
        console.log(change)

        if(change.operationType === "insert"){
            const { _id, message, name, timestamp, received } = change.fullDocument
            io.emit('sent', {
                messageId: _id,
                sent: true,
                message: "pesan terkirim dan telah masuk ke database"
            })
            // pusher.trigger("messages", "inserted", {
            //     message: message,
            //     name: name,
            //     timestamp: timestamp,
            //     received: received
            // })
        }else{
            console.log("operation type not inserted")
        }
    })
})


// ????


app.post('/test', async (req, res) => {
    try {
        const data = await Messages.create(req.body)
        if(data){
            res.status(201).send(data)
        }else{
            res.status(400).send('failed')
        }
    } catch (error) {
        res.status(500).send(error)
    }
})


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

app.use('/api/v1/', route)


var handle=null;
// var private=null;
var users={};
var keys={};


io.on('connection', (socket) => {
    console.log('a client connected, SocketID :', socket.id)

    socket.on('disconnect', () => {
        console.log('a client disconnected, SocketID :', socket.id)
    })
    
    socket.on('user-loggedin', (data) => {
        console.log("User Loggedin the apps :", data, "SocketID :", socket.id)
        // handle = JSON.parse(data)._id
        // variable.handle = JSON.parse(data)._id
        // console.log("Handle :", variable.handle)

        // io.to(socket.id).emit('handle', handle);
        // users[handle]=socket.id;
        // keys[socket.id]=handle;
    })

    socket.on('message', (msg) => {
        console.log('message :', msg)
        socket.emit('message', msg)
    })

    const id = socket.handshake.query.id
    socket.join(id)
    console.log('a client connected socketID :', socket.id, "userID :", id)
  
    // socket.on('send-message', ({ recipients, text, timestamp }) => {
    //   recipients.forEach(recipient => {
    //     console.log(recipient, text)
    //     const newRecipients = recipients.filter(r => r !== recipient)
    //     newRecipients.push(id)
    //     console.log(newRecipients)
    //     socket.broadcast.to(recipient).emit('receive-message', {
    //       recipients: newRecipients, sender: id, text, timestamp
    //     })
    //   })
    // })

    socket.on('send-message', ({ conversation_id, recipients, group, message }) => {
        console.log(recipients)
        const { text, timestamp } = message
        recipients.forEach(recipient => {
            console.log(recipient, text)
            const newRecipients = recipients.filter(r => r !== recipient)
            newRecipients.push(id)
            console.log(newRecipients)
            socket.broadcast.to(recipient).emit('receive-message', {
                conversation_id,
                group,
                recipients: newRecipients,
                message : {
                    sender: id, text, timestamp
                }
            })
        })
    })

    socket.on('add-group', async (payload) => {
        const recipients = payload.group_member
        const addGroup = await addGroupWithSocket(payload)

        recipients.forEach(recipient => {
            socket.broadcast.to(recipient).emit('add-group-res', addGroup)
        })
    })

})

// listen
// app.listen(port, () => {
//     console.log(`Listening on localhost:${port}`)
// })
server.listen(port, () => {
    console.log(`Listening on localhost:${port}`)
})