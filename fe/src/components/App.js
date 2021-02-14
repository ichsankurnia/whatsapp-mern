import React from 'react';
// import Pusher from "pusher-js";
import './App.css';

import useLocalStorage from '../hooks/useLocalStorage';
import Login from './Login';
import Dashboard from './Dashboard';

function App() {
	const [token, setToken] = useLocalStorage('token')																			// eslint-disable-line
	console.log(token)

	return (
		token? <Dashboard /> : <Login />
	);
}

export default App
