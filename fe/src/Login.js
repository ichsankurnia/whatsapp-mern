import React, { useEffect, useState } from 'react'
import App from './App'
import axios from './axios'
import './Login.css'

function Login(){
    const [app, setApp] = useState(false)
    const [register, setRegister] = useState(false)
    const [email, setEmail] = useState('')
    const [usn, setUsn] = useState('')
    const [pwd, setPwd] = useState('')


    useEffect(() => {
        if(localStorage.getItem('token')) setApp(true)
        else setApp(false)
    }, [])


    const moveToSignUp = () => {
        setRegister(!register)
        setEmail('')
        setUsn('')
        setPwd('')
    }

    const handleSubmitForm = async (e) => {
        e.preventDefault()
        if(register){
            const payload = {
                username: usn,
                password: pwd,
                email: email
            }

            axios.post('api/v1/user/sign-up', payload).then((res) => {
                console.log(res)
                alert(res.data.message)
                moveToSignUp()
            }).catch((err) => {
                if(err.response) alert(err.response.data.message)
                else alert(JSON.parse(JSON.stringify(err)).message)
            })
        }else{
            const payload = {
                username: usn,
                password: pwd
            }

            try {
                const res = await axios.post('api/v1/user/sign-in', payload)    
                console.log(res)
                localStorage.setItem('user', JSON.stringify(res.data.data))
                localStorage.setItem('token', res.data.token)
                setApp(true)
            } catch (error) {
                if(error.response) alert(error.response.data.message)
                else alert(JSON.parse(JSON.stringify(error)).message)
            }
        }
    }
    
    return (
        <>
        {app? 
            <App />
            :
            <div id="card">
                <div id="card-content">
                    <div id="card-title">
                        <h2>{register? "SIGN UP" : "SIGN IN"}</h2>
                        <div className="underline-title"></div>
                    </div>
                    <form className="form">
                        {register &&
                        <>
                            <label htmlFor="user-email" style={{marginTop: 22}}>
                                &nbsp;Email
                            </label>
                            <input id="user-email" className="form-content" type="email" name="email" onChange={(e) => setEmail(e.target.value)} value={email} autoComplete='true' required />
                            <div className="form-border"></div>
                            <div className="form-border"></div>
                            <label htmlFor="user-name" style={{paddingTop: 22}}>
                                &nbsp;Username
                            </label>
                            <input id="user-name" className="form-content" type="text" name="text" onChange={(e) => setUsn(e.target.value)} value={usn} required />
                            <div className="form-border"></div>
                            <div className="form-border"></div>
                        </>
                        }
                        {!register && 
                        <>
                            <label htmlFor="user-email" style={{marginTop: 22}}>
                                &nbsp;Username / Email
                            </label>
                            <input id="user-email" className="form-content" type="text" name="email" onChange={(e) => setUsn(e.target.value)} value={usn} autoComplete='true' required />
                            <div className="form-border"></div>
                            <div className="form-border"></div>
                        </>
                        }
                        <label htmlFor="user-password" style={{paddingTop: 22}}>
                            &nbsp;Password
                        </label>
                        <input id="user-password" className="form-content" type="password" name="password" onChange={(e) => setPwd(e.target.value)} value={pwd} required />
                        <div className="form-border"></div>
                        <div className="form-border"></div>
                        <input id="submit-btn" type="submit" name="submit" value={register? "SIGN UP" : "SIGN IN"} onClick={handleSubmitForm} />
                        <p id="signup" style={{cursor: 'pointer'}} onClick={moveToSignUp} >{register? "Already have an account" : "Don't have account yet"}</p>
                    </form>
                </div>
            </div>

        }
        </>
    )
}

export default Login