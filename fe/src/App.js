import React, { useEffect, useState } from 'react';
import Pusher from "pusher-js";
import axios from "./axios"
import './App.css';
import Sidebar from './Sidebar';
import Chat from './Chat';
import socket from './socket'

function App() {
	const [messages, setMessages] = useState([])

	useEffect(() => {
		axios.get("/messages/sync").then((res) => {
			setMessages(res.data)
		})
	}, [])

	useEffect(() => {
		const pusher = new Pusher('4495e494430a0c853b2a', {
			cluster: 'ap1'
		});

		const channel = pusher.subscribe('messages');
			channel.bind('inserted', (data) => {
			// alert(JSON.stringify(data));
			setMessages([...messages, data])
		});
		
		return () => {
			channel.unbind_all()
			channel.unsubscribe()
		}
    
	}, [messages])                                  // cantumkan state yg terupdate dalam function useEffect ini

	console.log(messages)

	return (
		<div className="app">
			<div className="app__body">
				<Sidebar />
				<Chat messages={messages} />
			</div>
		</div>
	);
}

export default App;
