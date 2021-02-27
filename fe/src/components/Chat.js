import React, { useEffect, useState } from "react";
import moment from 'moment-timezone';   
import "./Chat.css"

import axios from "./../axios"
// import socket from "./../socket";

import { Avatar, IconButton } from "@material-ui/core";
import { AttachFile, MoreVert, SearchOutlined, InsertEmoticon, Mic } from "@material-ui/icons";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setChatOn, setRoomChatID } from "./../redux/action/actions";
import { addConversation, addMessageToConversation } from "../redux/action/conversationAction";

import waOverview from './../assets/wa.png'
import { useSocket } from "../contexts/SocketProvider";
import { generateConversationID } from "./helper/helper";

moment.tz.setDefault("Asia/Jakarta");

function Chat({ /* messages, */ userState, globalState, conversationState, addConversation, addMessageToConversation, setRoomChatID }){                                        // props.messages
    const [messages, setMessages] = useState([])
    const [conversationID, setConversationID] = useState('')
    const [text, setText] = useState('')
    const socket = useSocket()
    const userPhone = JSON.parse(localStorage.getItem('whatsapp-mern-user'))?.phone_number
    const recipients = [userState.room_chat.phone_number]


    useEffect(() => {
		var objDiv = document.getElementById("chat__body");
		if(objDiv){
			objDiv.scrollTop = objDiv.scrollHeight;
		}
	}, [messages, globalState.chatOn])


    const sendMessage = async (e) => {
        e.preventDefault()

        // const payload = {
        //     name: "ories",
        //     message: text,
        //     timestamp: moment(new Date()).format("dddd, DD-MM-YYYY hh:mm:ss A"),
        //     received: true
        // }

        // if(text !== ''){
        //     socket.emit('message', payload)
        //     await axios.post('messages/new', payload)
        // }
        
        if(text !== ''){
            // socket.emit('send-message', payload)

            checkConversationExist()
        }

        setText('')
    }

    const checkConversationExist = () => {
        
        const payloadMessage = {
            name: "ories",
            text: text,
            timestamp: moment(new Date()).format("dddd, DD-MM-YYYY hh:mm:ss A"),
            sender: userPhone
        }

        const payloadConversation = {
            conversation_id: conversationID,
            group: false,
            recipients,
            message: payloadMessage
        }
        

        if(recipients.length > 1){
            payloadConversation.group = true
        }else{
            const filterConv = conversationState.filter(data => data.recipients.length === 1 && data.recipients[0] === userState.room_chat.phone_number)
    
            if(filterConv.length > 0){
                console.log('conversation telah ada, add message to conversation')
                setConversationID(filterConv[0].conversation_id)
                
                payloadConversation.conversation_id = filterConv[0].conversation_id
                addMessageToConversation(filterConv[0].conversation_id, payloadMessage)
                // addMessageToConversation(conversationID, payloadMesssage)
            }else{
                console.log('conversation belum ada')
                const conversationId = gntConversationId()

                setConversationID(conversationId)
                setRoomChatID(conversationId)
                payloadConversation.conversation_id = conversationId
                addConversation(1, 3, createConversation(conversationState, payloadConversation))
            }
        }

        socket.emit('send-message', payloadConversation)
    }

    const createConversation = (prevConversation, payloadConversation) => {
        const { conversation_id, group, recipients, message } = payloadConversation

        return [...prevConversation, {conversation_id, group, recipients, messages: [message]}]
    }


    const gntConversationId = () => {
        const randomNumber = Math.floor((Math.random() * 100000) + 1).toString()

        return generateConversationID(userPhone, randomNumber)
    }

    console.log(conversationState, userState.room_chat)
    
    return (
        <>
        {globalState.chatOn?
        <div className="chat">
            <div className="chat__header">
               <Avatar />

               <div className="chat__headerInfo">
                   <h3>{userState.room_chat? userState.room_chat.username : "Room name"}</h3>
                   <p>{userState.room_chat? userState.room_chat.phone_number : "Last seen at..."}</p>
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
                {/* {messages.map(({ name, message, timestamp, received }, key) => (                               // destructure object (data, key) */}
                {messages.map(({ name, text, timestamp, sender }, key) => (                               // destructure object (data, key)
                    <p className={`chat__message ${sender === userPhone && "chat__receiver"}`} key={key}>
                        <span className="chat__name">{name}</span>
                        {text}
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
        :
        <div className="chat">
            <img src={waOverview} alt="overview" height='100%' />
        </div>
        }
        </>

    )
}

const mapStateToProps = (state) => {
    return {
        globalState: state.global,
        userState: state.user,
        conversationState: state.conversation
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({setChatOn, setRoomChatID, addConversation, addMessageToConversation}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat)