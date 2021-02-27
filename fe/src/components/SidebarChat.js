import React, { useEffect, useState } from "react"
import "./SidebarChat.css"

import { Avatar } from "@material-ui/core"
import { connect } from "react-redux"


function SidebarChat({selected, onClick, conversation, userState}){
    // const [listConvBasedContact, setListConvBasedContact] = useState([])
    // const [name, setName] = useState('')

    useEffect(() => {
        // conversation?.recipients.forEach(phone_number => {
        console.log(userState.contact_list.find(contacts => contacts.contact.phone_number === '6281234567891')?.contact.username)
        // });
    })

    console.log(userState.contact_list)

    
    return(
        <div className={selected? "sidebarChat-active" : "sidebarChat"} onClick={onClick}>
            <Avatar />
            <div className="sidebarChat__info">
                {
                    conversation?.recipients.map((data, index) => (
                        <h2 key={index}>
                            {/* <span>{userState.contact_list.find(contacts => contacts.contact.phone_number === data)?.contact.username}</span> */}
                            {userState.contact_list.find(contacts => contacts.contact.phone_number === data)? 
                                userState.contact_list.find(contacts => contacts.contact.phone_number === data).contact.username
                                : 
                                data 
                            }
                        </h2>
                    ))
                    // conversation?.recipients.map((data, index) => (
                    //     <h2 key={index}>{data}</h2>
                    // ))
                }
                <p>{conversation?.messages[conversation.messages.length - 1].text}</p>
                {/* <h2>Room Name</h2> */}
                {/* <p>This is the last message</p> */}
            </div>
        </div>
    ) 
}

const mapStateToProps = (state) => {
    return {
        userState: state.user
    }
}

export default connect(mapStateToProps, null)(SidebarChat)