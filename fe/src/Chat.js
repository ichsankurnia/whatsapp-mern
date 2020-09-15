import React from "react";
import "./Chat.css"

import { Avatar, IconButton } from "@material-ui/core";
import { AttachFile, MoreVert, SearchOutlined, InsertEmoticon, Mic } from "@material-ui/icons";

function Chat(){
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

            <div className="chat__body">
                <p className="chat__message">
                    <span className="chat__name">Ories</span>
                    This is a message
                    <span className="chat__timestamp">{new Date().toUTCString()}</span>
                </p>

                <p className="chat__message chat__receiver">
                    <span className="chat__name">Ichsan</span>
                    This is a message
                    <span className="chat__timestamp">{new Date().toUTCString()}</span>
                </p>

                <p className="chat__message">
                    <span className="chat__name">Ories</span>
                    This is a message
                    <span className="chat__timestamp">{new Date().toUTCString()}</span>
                </p>
            </div>

            <div className="chat__footer">
                <InsertEmoticon />
                <AttachFile />
                <form>
                    <input type="text" placeholder="Type a message" />
                    <button type="submit" />
                </form>
                <Mic />
            </div>

        </div>
    )
}

export default Chat