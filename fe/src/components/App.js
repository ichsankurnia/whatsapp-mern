import React, { useEffect } from 'react';
// import Pusher from "pusher-js";
import jwt_decode from 'jwt-decode'
import './App.css';

import useLocalStorage from '../hooks/useLocalStorage';
import Login from './Login';
import Dashboard from './Dashboard';
import { SocketProvider } from '../contexts/SocketProvider';


function App() {
	const [token, setToken] = useLocalStorage('token')																			// eslint-disable-line
	const [user, setUser] = useLocalStorage('user')																				// eslint-disable-line
	console.log(user?.email)

	useEffect(() => {
		if(token && token !== "undefined" && token !== undefined ){
		// if(token){
			const decoded = jwt_decode(token)
			const currentTime = Date.now() / 1000;

			if(decoded.exp < currentTime){
				localStorage.clear()
			}
		}else{
			localStorage.clear()
		}
	}, [])																														// eslint-disable-line

	const dashboard = (
		<SocketProvider id={user?.phone_number}>
			<Dashboard id={user?._id} />
		</SocketProvider>
	)

	return (
		token? dashboard : <Login submitToken={setToken} submitUser={setUser} />
	);
}

export default App
