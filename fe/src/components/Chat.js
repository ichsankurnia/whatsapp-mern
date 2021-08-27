import React, { useEffect, useState } from "react";
import moment from 'moment-timezone';   
import "./Chat.css"

// import axios from "./../axios"
// import socket from "./../socket";

import { Avatar, IconButton } from "@material-ui/core";
import { AttachFile, MoreVert, SearchOutlined, InsertEmoticon, Mic } from "@material-ui/icons";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setChatOn } from "./../redux/action/actions";
import { setRoomChatID } from "../redux/action/chatAction";
import { addConversation, addMessageToConversation } from "../redux/action/conversationAction";

import waOverview from './../assets/wa.png'
import { useSocket } from "../contexts/SocketProvider";
import { createConversation, generateConversationID } from "./helper/helper";

moment.tz.setDefault("Asia/Jakarta");

function Chat({ /* messages, */userState, globalState, conversationState, addConversation, addMessageToConversation, chatState, setRoomChatID }){                                        // props.messages
    const [messages, setMessages] = useState([])
    const [text, setText] = useState('')
    const [conversationID, setConversationID] = useState('')
    
    const socket = useSocket()
    const user = JSON.parse(localStorage.getItem('whatsapp-mern-user'))
    const userPhone = user?.phone_number


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
            name: user?.profile_id?.fullname ||user?.username,
            text: text,
            timestamp: moment(new Date()).format("dddd, DD-MM-YYYY hh:mm:ss A"),
            sender: userPhone
        }

        const payloadConversation = {
            conversation_id: conversationID,
            group: false,
            recipients: chatState.recipients_chat,
            message: payloadMessage
        }
        

        if(chatState.group_chat){
            payloadConversation.group = true

            const filterConv = conversationState.filter(data => data.conversation_id === chatState.room_chat_id)
    
            if(filterConv.length > 0){
                console.log('conversation telah ada, add message to conversation')
                setConversationID(filterConv[0].conversation_id)
                
                payloadConversation.conversation_id = filterConv[0].conversation_id
                addMessageToConversation(filterConv[0].conversation_id, payloadMessage)
                // addMessageToConversation(conversationID, payloadMesssage)
            }else{
                console.log('conversation belum ada')

                setConversationID(chatState.room_chat_id)
                payloadConversation.conversation_id = chatState.room_chat_id

                addConversation(createConversation(payloadConversation))
            }
        }else{
            const filterConv = conversationState.filter(data => data.recipients.length === 1 && data.recipients[0] === chatState.recipients_chat[0])
            // const convExist = conversationState.filter(data => data.recipients.length === 1 && data.recipients[0] === chatState.recipients_chat[0])
            console.log(filterConv)
    
            if(filterConv.length > 0){
                console.log('conversation telah ada, add message to conversation')
                setConversationID(filterConv[0].conversation_id)
                
                payloadConversation.conversation_id = filterConv[0].conversation_id
                setRoomChatID(filterConv[0].conversation_id)
                addMessageToConversation(filterConv[0].conversation_id, payloadMessage)
                // addMessageToConversation(conversationID, payloadMesssage)
            }else{
                console.log('conversation belum ada')
                const conversationId = gntConversationId()

                setConversationID(conversationId)
                setRoomChatID(conversationId)
                payloadConversation.conversation_id = conversationId

                addConversation(createConversation(payloadConversation))
            }
        }
        setMessages([...messages, payloadMessage])

        socket.emit('send-message', payloadConversation)
    }


    const gntConversationId = () => {
        return generateConversationID(userPhone)
    }
    
    return (
        <>
        {globalState.chatOn?
        <div className="chat">
            <div className="chat__header">
               <Avatar />

               <div className="chat__headerInfo">
                   <h3>{chatState.group_chat? chatState.room_chat.group_name : chatState.room_chat? chatState.room_chat.username : "Room name"}</h3>
                   <div style={{display: "flex", color: 'gray'}}>
                   {chatState.group_chat?
                        chatState.room_chat.group_member.map((phoneNumber) => (
                            <p key={phoneNumber}>{phoneNumber},&nbsp;</p>
                            ))
                            :
                            <p>{chatState.room_chat? chatState.room_chat.phone_number : "Last seen at..."}</p>
                        }
                    </div>
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
            
                {chatState.group_chat?
                    conversationState.find(conversation => conversation.conversation_id === chatState.room_chat_id)?
                        conversationState.find(conversation => conversation.conversation_id === chatState.room_chat_id).messages.map(({ name, text, timestamp, sender }, key) => (                               // destructure object (data, key)
                            <p className={`chat__message ${sender === userPhone && "chat__receiver"}`} key={key}>
                                <span className="chat__name">
                                    {name || (userState.contact_list.find(data => data.contact.phone_number === sender)? userState.contact_list.find(data => data.contact.phone_number === sender).contact.username || userState.contact_list.find(data => data.contact.phone_number === sender).contact.profile_id.fullname : sender) }                                    
                                    </span>
                                {text}
                                <span className="chat__timestamp">{timestamp}</span>
                            </p>
                        ))
                        :
                        null
                    :
                    conversationState.find(conversation => conversation.group === false && conversation.recipients[0] === chatState.recipients_chat[0])?
                        conversationState.find(conversation => conversation.group === false && conversation.recipients[0] === chatState.recipients_chat[0]).messages.map(({ name, text, timestamp, sender }, key) => (                               // destructure object (data, key)
                            <p className={`chat__message ${sender === userPhone && "chat__receiver"}`} key={key}>
                                <span className="chat__name">
                                    {name || (userState.contact_list.find(data => data.contact.phone_number === sender)? userState.contact_list.find(data => data.contact.phone_number === sender).contact.username || userState.contact_list.find(data => data.contact.phone_number === sender).contact.profile_id.fullname : sender) }
                                </span>
                                {text}
                                <span className="chat__timestamp">{timestamp}</span>
                            </p>
                        ))
                        :
                        null
                }
            </div>

            <div className="chat__footer">
                <InsertEmoticon />
                <AttachFile />
                <form>
                    <input type="text" placeholder="Type a message" value={text} onChange={(e) => setText(e.target.value)} autoFocus />
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
        conversationState: state.conversation,
        chatState: state.chat,
        userState: state.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({setChatOn, setRoomChatID, addConversation, addMessageToConversation}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat)