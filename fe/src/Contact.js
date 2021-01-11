import React from 'react'
import './Contact.css'

import { AddCircle, ArrowBack, PersonAdd, SearchOutlined } from '@material-ui/icons'
import { Avatar, IconButton } from '@material-ui/core'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setContactOnOff } from './redux/action/actions'


function ContactChild(){
    return (
        <div className="sidebarChat">
            <Avatar />
            <div className="sidebarChat__info">
                <h2>Contact Name</h2>
                <p>busy...</p>
            </div>
        </div>
    )
}

function Contact({setContactOnOff}){
    const [NC, setNC] = React.useState(false)

    const handleArrowBackClick = (e) => {
        e.preventDefault()

        if(NC) setNC(!NC)
        else setContactOnOff(false)
    }

    console.log(NC)
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
                    <input type="text" placeholder="Type phone number to add" />
                {/* </div> */}
                <IconButton>
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
                    <ContactChild />
                    <ContactChild />
                    <ContactChild />
                </div>
            </>
            }
        </div>
    )
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({setContactOnOff}, dispatch)
}


export default connect(null, mapDispatchToProps)(Contact)