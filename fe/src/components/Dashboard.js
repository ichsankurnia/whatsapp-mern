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
import { setContactList, setConversationList } from '../redux/action/actions';

import { useSocket } from '../contexts/SocketProvider';


function Dashboard({id, globalState, setContactList, setConversationList}) {
	const [messages, setMessages] = useState([])

	const socket = useSocket()


	useEffect(() => {
		axios.get("/messages/sync").then((res) => {
			setMessages(res.data)
		})

		if (socket == null) return

		socket.emit('user-loggedin', localStorage.getItem('whatsapp-mern-user'))
		
		socket.on("handle", (data) => {
			console.log(data)
		})
		
		socket.on('sent', (data) => {
			console.log(data)
		})
		
		socket.on('message', (data) => {
			console.log(data)
		})

	}, [socket])


	useEffect( () => {

		async function fetchData(){
			try {
				const res = await axios.get(`api/v1/user/${id}`)
				console.log("GET USER BY ID", res)
				
				setContactList(res.data.data.contacts)
				setConversationList(res.data.data?.conversation)
			} catch (error) {
				if(error.response) alert(error.response.data.message)
				else alert(JSON.parse(JSON.stringify(error)).message)
			}
		}

		fetchData()
	}, [id, setContactList, setConversationList])


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
	useEffect(() => {
		if (socket == null) return	

		socket.on('message', (msg) => {
			setMessages([...messages, msg])
		})
	}, [messages, socket])


	return (
		<div className="app">
			<div className="app__body">
				{globalState.contactOn? 
				<Contact id={id} />
				:
				<Sidebar id={id} />
				}
				<Chat messages={messages} />
			</div>
		</div>
	);
}


const mapStateToProps = (state) => {
    return {
        globalState: state.global
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({setContactList, setConversationList}, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)