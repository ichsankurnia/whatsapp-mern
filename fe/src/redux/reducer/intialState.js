const initialState = {
    global: {
        chatOn: false,
        contactOn: false
    },
    user: {
        user_id: "",
        phone_number: "",
        contact_list: [
    
        ],
        conversation_list: [
    
        ],
        group_list: [

        ]
    },
    chat: {
        room_chat_id: {

        },
        room_chat: {

        },
        from_chat: false,
        group_chat: false,
        recipients_chat: [

        ],
    },
    conversations: [
        
    ]
}

export default initialState