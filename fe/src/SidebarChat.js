import React from "react"
import "./SidebarChat.css"
import { Avatar } from "@material-ui/core"
import { setChatOn } from "./redux/action/actions"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"


function SidebarChat({setChatOn}){
    return(
        <div className="sidebarChat" onClick={setChatOn}>
            <Avatar />
            <div className="sidebarChat__info">
                <h2>Room Name</h2>
                <p>This is the last message</p>
            </div>
        </div>
    ) 
}

const mapStateToProps = (state) => {
    return {
        globalState: state.global
    }
}


const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({setChatOn}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SidebarChat)