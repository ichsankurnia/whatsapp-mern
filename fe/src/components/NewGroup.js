import React from 'react'
import './Contact.css'

import { AddCircle } from '@material-ui/icons'
import { IconButton } from '@material-ui/core'

import { generateConversationID } from './helper/helper'
import { useSocket } from '../contexts/SocketProvider'


function NewGroup({contactList, groupList, setGroupList, showNG}){
    const [groupName, setGroupName] = React.useState('')
    const [groupMember, setGroupMember] = React.useState([])

    const socket = useSocket()

    const handleChangeCheckBoxNewGroup = (e) => {
        // if checkbox is checked add phone_number to list, else remove them from list
        if(e.target.checked){
            if(!groupMember.find(member => member === e.target.value)){
                setGroupMember([...groupMember, e.target.value])
            }
        }else{
            setGroupMember(groupMember.filter(member => member !== e.target.value))
        }
    }

    const handleAddNewGroup = async () => {
        if(groupMember.length > 0){
            console.log(groupMember)
            
            try {
                const payload = {
                    "group_id": generateConversationID(JSON.parse(localStorage.getItem('whatsapp-mern-user')).phone_number),
                    "group_name": groupName,
                    "group_desc": "",
                    "group_photo": "",
                    "group_member": [...groupMember, JSON.parse(localStorage.getItem('whatsapp-mern-user')).phone_number],
                    "group_maker": JSON.parse(localStorage.getItem('whatsapp-mern-user'))._id
                }
    
                socket.emit('add-group', payload)
                setGroupList([...groupList, payload])
    
                showNG(false)
            } catch (error) {
                if(error.response) alert(error.response.data.message)
                else alert(JSON.parse(JSON.stringify(error)).message)
            }
        }else{
            alert('Please select member of group first !')
        }
    }

    return (
        <>
            <div className="contact__searchNew">
                {/* <div className="sidebar__searchContainer"> */}
                    <input type="text" value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder="Type group name" style={{fontSize: 25}} />
                {/* </div> */}
            </div>
            <div className="contact__newGroup" style={{marginBottom: 20}}>
                {contactList.map((contact, index) => (
                    <div key={index}>
                        <input type='checkbox' id={contact.contact.phone_number} value={contact.contact.phone_number} onChange={handleChangeCheckBoxNewGroup} />
                        <label htmlFor={contact.contact.phone_number}>
                            {contact.contact.username}
                        </label>
                    </div>    
                ))}
            </div>
            <IconButton className="contact_groupAddIcon" onClick={handleAddNewGroup}>
                <AddCircle />
            </IconButton>
        </>
    )    
}

export default NewGroup