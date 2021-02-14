import React, { useEffect, useState } from 'react';
// import Pusher from "pusher-js";
import './App.css';

import axios from "./../axios"
import socket from './../socket'

import Sidebar from './Sidebar';
import Chat from './Chat';
import Contact from './Contact';

import { connect } from 'react-redux';


function Dashboard({globalState}) {
	const [messages, setMessages] = useState([])

	useEffect(() => {
		axios.get("/messages/sync").then((res) => {
			setMessages(res.data)
		})

		socket.emit('user-loggedin', localStorage.getItem('whatsapp-mern-user'))
	}, [])


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
		socket.on('message', (msg) => {
			setMessages([...messages, msg])
		})
	}, [messages])


	return (
		<div className="app">
			<div className="app__body">
				{globalState.contactOn? 
				<Contact />
				:
				<Sidebar />
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


export default connect(mapStateToProps, null)(Dashboard)