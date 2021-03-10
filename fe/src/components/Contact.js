import React from 'react'
import './Contact.css'

import { AddCircle, ArrowBack, PersonAdd, SearchOutlined } from '@material-ui/icons'
import { Avatar, IconButton } from '@material-ui/core'

import axios from "./../axios"

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setContactOnOff, setContactList, setChatOn, } from './../redux/action/actions'
import { setRecipientsChat, setRoomChatData } from '../redux/action/chatAction'


function ContactChild(props){
    const { contact } = props

    return (
        <div className="sidebarChat">
            <Avatar />
            <div className="sidebarChat__info" onClick={() => props.onClickContactChat(contact)}>
                <h2>{contact?.username}</h2>
                <p>{contact?.profile_id?.about}</p>
            </div>
        </div>
    )
}

function Contact({id, setContactOnOff, userState, setContactList, setChatOn, setRoomChatData, setRecipientsChat}){
    const [NC, setNC] = React.useState(false)
    const [newContact, setNewContact] = React.useState('')

    const handleArrowBackClick = (e) => {
        e.preventDefault()

        if(NC) setNC(!NC)
        else setContactOnOff(false)
    }


    const handleAddNewContact = async (e) => {
        e.preventDefault()

        try {
            const payload = {
                "user_id": id,
                "new_contact": newContact
            }

            const res = await axios.post(`api/v1/contact`, payload)
            
            console.log("Add new contact :", res.data.data)
            
            setContactList(res.data.data.contacts)
            setNC(!NC)
        } catch (error) {
            if(error.response) alert(error.response.data.message)
            else alert(JSON.parse(JSON.stringify(error)).message)
        }
    }

    const handleClickContactToChat = (user) => {
        console.log(user)
        setRoomChatData(user)
        setRecipientsChat([user.phone_number])
        setContactOnOff(false)
        setChatOn(true)
    }

    return (
        <div className="contact">
            <div className="contact__header">
                <IconButton onClick={handleArrowBackClick}>
                    <ArrowBack />
                </IconButton>
                <p>{NC? 'Add new contact' : 'New chat'}</p>
            </div>

            {NC?
            <div className="contact__searchNew">
                {/* <div className="sidebar__searchContainer"> */}
                    <input type="text" value={newContact} onChange={(e) => setNewContact(e.target.value)} placeholder="Type phone number to add" style={{fontSize: 25}} />
                {/* </div> */}
                <IconButton onClick={handleAddNewContact}>
                    <AddCircle />
                </IconButton>
            </div>
            :
            <>
                <div className="sidebar__search">
                    <div className="sidebar__searchContainer">
                        <SearchOutlined />
                        <input type="text" placeholder="Search or start new chat" />
                    </div>
                </div>

                <div className="sidebar__chats">
                    <div className="sidebarChat" onClick={() => setNC(!NC)}>
                        {/* <IconButton> */}
                            <PersonAdd />
                        {/* </IconButton> */}
                        <div className="sidebarChat__info">
                            <h2>New contact</h2>
                        </div>
                    </div>
                    {userState.contact_list && userState.contact_list.map((contact, key) => (
                        <ContactChild 
                            key={key} 
                            contact={contact.contact} 
                            onClickContactChat={handleClickContactToChat} 
                        />
                    ))}
                    <ContactChild />
                    <ContactChild />
                </div>
            </>
            }
        </div>
    )
}


const mapStateToProps = (state) => {
    return {
        userState: state.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({setContactOnOff, setChatOn, setContactList, setRoomChatData, setRecipientsChat}, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(Contact)