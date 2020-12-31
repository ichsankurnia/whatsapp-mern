import React, { useState } from "react";
import "./Chat.css"
import axios from "./axios"
import moment from 'moment-timezone';   

import { Avatar, IconButton } from "@material-ui/core";
import { AttachFile, MoreVert, SearchOutlined, InsertEmoticon, Mic } from "@material-ui/icons";
import socket from "./socket";

moment.tz.setDefault("Asia/Jakarta");

function Chat({ messages }){                                        // props.messages
    const [text, setText] = useState('')

    const sendMessage = async (e) => {
        e.preventDefault()

        const payload = {
            name: "ories",
            message: text,
            timestamp: moment(new Date()).format("dddd, DD-MM-YYYY hh:mm:ss A"),
            received: true
        }

        if(text !== ''){
            socket.emit('message', payload)
            const res = await axios.post('messages/new', payload)

            console.log(res)
        }

        setText('')
    }

    return (
        <div className="chat">
            <div className="chat__header">
               <Avatar />

               <div className="chat__headerInfo">
                   <h3>Room name</h3>
                   <p>Last seen at...</p>
               </div>

               <div className="chat__headerRight">
                   <IconButton>
                        <SearchOutlined />
                   </IconButton>
                   <IconButton>
                       <MoreVert />
                   </IconButton>
               </div>
            </div>

            <div className="chat__body" id="chat__body">
                {messages.map(({ name, message, timestamp, received }, key) => (                               // destructure object (data, key)
                    <p className={`chat__message ${received && "chat__receiver"}`} key={key}>
                        <span className="chat__name">{name}</span>
                        {message}
                        <span className="chat__timestamp">{timestamp}</span>
                    </p>
                ))}
            </div>

            <div className="chat__footer">
                <InsertEmoticon />
                <AttachFile />
                <form>
                    <input type="text" placeholder="Type a message" value={text} onChange={(e) => setText(e.target.value)} autoFocus={true} />
                    <button type="submit" onClick={sendMessage} />
                </form>
                <Mic />
            </div>

        </div>
    )
}

export default Chat