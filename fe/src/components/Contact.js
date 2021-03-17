import React from 'react'
import './Contact.css'

import { AddCircle, ArrowBack, GroupAdd, PersonAdd, SearchOutlined } from '@material-ui/icons'
import { Avatar, IconButton } from '@material-ui/core'

import axios from "./../axios"

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setContactOnOff, setContactList, setChatOn, setGroupList, } from './../redux/action/actions'
import { setFromChat, setGroupChatStatus, setRecipientsChat, setRoomChatData, setRoomChatID } from '../redux/action/chatAction'
import NewGroup from './NewGroup'


function ContactChild(props){
    const { contact } = props
    
    return (
        <div className="sidebarChat" onClick={() => props.onClickContactChat(contact)}>
            <Avatar />
            <div className="sidebarChat__info">
                <h2>{contact?.username}</h2>
                <p>{contact?.profile_id?.about}</p>
            </div>
        </div>
    )
}

function GroupChild(props){
    const { group } = props

    return (
        <div className="sidebarChat"  onClick={() => props.onClickGroupChat(group)}>
            <Avatar />
            <div className="sidebarChat__info">
                <h2>{group?.group_name}</h2>
                <p>{group?.group_desc}</p>
            </div>
        </div>
    )
}


function Contact({id, setContactOnOff, userState, setContactList, setGroupList, setChatOn, setRoomChatData, setRoomChatID, setRecipientsChat, setGroupChatStatus, setFromChat}){
    const [NC, setNC] = React.useState(false)
    const [showNG, setShowNG] = React.useState(false)
    const [newContact, setNewContact] = React.useState('')

    const handleArrowBackClick = (e) => {
        e.preventDefault()

        if(NC) setNC(!NC)
        else if(showNG) setShowNG(!showNG)
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

    const handleClickContactToChat = (data) => {
        if(data.group_id){
            setRoomChatID(data.group_id)
            setRecipientsChat(data.group_member.filter(r => r !== JSON.parse(localStorage.getItem('whatsapp-mern-user')).phone_number))
            setGroupChatStatus(true)
        }else{
            setRecipientsChat([data.phone_number])
            setGroupChatStatus(false)
        }
        setRoomChatData(data)
        setFromChat(false)
        setContactOnOff(false)
        setChatOn(true)
    }


    return (
        <div className="contact">
            <div className="contact__header">
                <IconButton onClick={handleArrowBackClick}>
                    <ArrowBack />
                </IconButton>
                <p>{NC? 'Add new contact' : showNG? 'Add New Group' : 'New chat'}</p>
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
            showNG?
               <NewGroup 
                contactList={userState.contact_list} 
                groupList={userState.group_list} 
                setGroupList={setGroupList} 
                showNG={(bool) => setShowNG(bool)} />
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
                </div>
                <div className="sidebar__chats">
                    <div className="sidebarChat" onClick={() => setShowNG(!showNG)}>
                        {/* <IconButton> */}
                            <GroupAdd />
                        {/* </IconButton> */}
                        <div className="sidebarChat__info">
                            <h2>New Group</h2>
                        </div>
                    </div>
                    {userState.group_list && userState.group_list.map((group, key) => (
                        <GroupChild 
                            key={key} 
                            group={group}
                            onClickGroupChat={handleClickContactToChat}
                        />
                    ))}
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
    return bindActionCreators({
        setContactOnOff, setChatOn, 
        setContactList, setGroupList, 
        setRoomChatData, setRoomChatID, setRecipientsChat, setGroupChatStatus, setFromChat
    }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(Contact)