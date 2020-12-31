import React, { Fragment, useEffect, useState } from 'react'
import App from './App';
import Login from './Login';

function Main(){
    const [login, setLogin] = useState(true)

    useEffect(() => {
        if(localStorage.getItem('token')) setLogin(false)
        else setLogin(true)
    }, [])

    return (
		<Fragment>
		{login?
            <Login />
            :
			<App />
		}
		</Fragment>
	);
}

export default Main