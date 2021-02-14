import React, { useEffect, useState } from 'react';
// import Pusher from "pusher-js";
import axios from "./axios"
import './App.css';
import Sidebar from './Sidebar';
import Chat from './Chat';
import socket from './socket'
import { connect } from 'react-redux';
import { setChatOn } from './redux/action/actions';
import { bindActionCreators } from 'redux';
import Contact from './Contact';

function App({globalState, setChatOn}) {
	const [messages, setMessages] = useState([])

	useEffect(() => {
		axios.get("/messages/sync").then((res) => {
			setMessages(res.data)
		})

		socket.emit('user-loggedin', localStorage.getItem('user'))
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


	useEffect(() => {
		var objDiv = document.getElementById("chat__body");
		if(objDiv){
			objDiv.scrollTop = objDiv.scrollHeight;
		}
	}, [messages, globalState.chatOn])


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


const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({setChatOn}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
