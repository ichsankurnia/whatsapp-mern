import React from "react"
import "./SidebarChat.css"

import { Avatar } from "@material-ui/core"
import { connect } from "react-redux"


function SidebarChat({selected, onClick, conversation, userState}){
    
    return(
        <div className={selected? "sidebarChat-active" : "sidebarChat"} onClick={onClick}>
            <Avatar />
            <div className="sidebarChat__info">
                {conversation?.group?
                        <h2>
                            {/* <span>{userState.contact_list.find(contacts => contacts.contact.phone_number === data)?.contact.username}</span> */}
                            {userState.group_list.find(groups => groups.group_id === conversation.conversation_id)? 
                                userState.group_list.find(groups => groups.group_id === conversation.conversation_id).group_name
                                : 
                                `conversation id ${conversation.conversation_id}` 
                            }
                        </h2>
                    :
                    conversation?.recipients?.map((data, index) => (
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