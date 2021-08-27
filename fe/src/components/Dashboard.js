import React, { useEffect, useState } from 'react';
// import Pusher from "pusher-js";
import './App.css';

import axios from "./../axios"
// import socket from './../socket'

import Sidebar from './Sidebar';
import Chat from './Chat';
import Contact from './Contact';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setContactList, setConversationList, setGroupList } from '../redux/action/actions';
import { addConversation, addMessageToConversation, updateConversationID } from '../redux/action/conversationAction';

import { useSocket } from '../contexts/SocketProvider';
import { CircularProgress } from '@material-ui/core';
import { createConversation } from './helper/helper';


function Dashboard({
	id, 
	globalState, userState, conversationState,
	setContactList, setGroupList, setConversationList, 
	addConversation, addMessageToConversation, updateConversationID
}) {
	// const [messages, setMessages] = useState([])
	const [showLoader, setShowLoader] = useState(true)

	const socket = useSocket()

	useEffect(() => {
		// axios.get("/messages/sync").then((res) => {
		// 	setMessages(res.data)
		// })

		if (socket == null) return

		socket.emit('user-loggedin', localStorage.getItem('whatsapp-mern-user'))

		// socket.on('receive-message', (data) => {
			// console.log(data)
		socket.on('receive-message', async (conversation) => {
			const {conversation_id, group, recipients, message} = conversation
			const exist = obj => obj.conversation_id === conversation_id;

			console.log(conversation)
			console.log(conversationState.some(exist))

			if(conversationState.some(exist)){
				console.log('conversation telah ada, add message to conversation')
				addMessageToConversation(conversation_id, message)
			}else{
				if( !group && conversationState.find(conv => conv.recipients.length === 1 && conv.recipients[0] === recipients[0]) ){
					updateConversationID(conversation_id, recipients, message)
					// addMessageToConversation(conversation_id, message)
				}else{
					// addNewConversation(conversation)
					addConversation(createConversation(conversation))
				}
			}

		})

		socket.on('add-group-res', (res) => {
			console.log('New Group', res)
			if(res.code === 0){
				if(!userState.group_list.find(data => data.group_id === res.data.group_id )){
					setGroupList([...userState.group_list, res.data])
				}
			}
		})

		return () => {
			socket.off('receive-message')
			socket.off('add-group-res')
		} 

	}, [socket, userState.group_list, conversationState, addConversation, addMessageToConversation, updateConversationID, setGroupList])



	useEffect( () => {
		async function fetchData(){
			try {
				const res = await axios.get(`api/v1/user-detail/${id}`)
				console.log("GET USER BY ID", res)
				
				setContactList(res.data.data.contacts)
				setGroupList(res.data.data.groups)
				setConversationList(res.data.data?.conversation)
				setShowLoader(false)
			} catch (error) {
				// if(error.response) alert(error.response.data.message)
				// else alert(JSON.parse(JSON.stringify(error)).message)
				fetchData()
			}
		}

		fetchData()
	}, [id, setContactList, setGroupList, setConversationList])


	// useEffect(() => {
	// 	const pusher = new Pusher('4495e494430a0c853b2a', {
	// 		cluster: 'ap1'
	// 	});

	// 	const channel = pusher.subscribe('messages');
	// 		channel.bind('inserted', (data) => {
	// 		// alert(JSON.stringify(data));
	// 		setMessages([...messages, data])
	// 	});
		
	// 	return () => {
	// 		channel.unbind_all()
	// 		channel.unsubscribe()
	// 	}
    
	// }, [messages])                                  // cantumkan state yg terupdate dalam function useEffect ini
	// useEffect(() => {
	// 	if (socket == null) return	

	// 	socket.on('message', (msg) => {
	// 		setMessages([...messages, msg])
	// 	})
	// }, [messages, socket])


	return (
		<div className="app">
			{showLoader && <CircularProgress style={{color: '#4caf50'}} />}
			<div className="app__body">
				{globalState.contactOn? 
				<Contact id={id} />
				:
				<Sidebar id={id} />
				}
				<Chat /* messages={messages} */ />
			</div>
		</div>
	);
}


const mapStateToProps = (state) => {
    return {
        globalState: state.global,
		conversationState: state.conversation,
		userState: state.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({setContactList, setGroupList, setConversationList, addConversation, addMessageToConversation, updateConversationID}, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)