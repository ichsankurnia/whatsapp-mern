import React from "react";
import "./Sidebar.css";
import SidebarChat from "./SidebarChat";

import { Avatar, IconButton } from "@material-ui/core";
import DonutLargeIcon from "@material-ui/icons/DonutLarge"
import ChatIcon from "@material-ui/icons/Chat"
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { SearchOutlined } from "@material-ui/icons";
import MenuItem from '@material-ui/core/MenuItem';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuList from '@material-ui/core/MenuList';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setContactOnOff } from "./redux/action/actions";


function Sidebar({setContactOnOff}){
    const [option, setOption] = React.useState(false)

    const anchorRef = React.useRef(null);

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
          return;
        }
    
        setOption(false);
    };


    const handleLogout = () => {
        localStorage.clear()
        window.location.reload()
    }


    return (
        <div className="sidebar">
            
            <div className="sidebar__header">
                <Avatar src="https://ui-avatars.com/api/?name=Ichsan+Kurniawan&background=0D8ABC&color=fff"/>
                <div className="sidebar__headerRight">
                    <IconButton>
                        <DonutLargeIcon />
                    </IconButton>
                    <IconButton onClick={() => setContactOnOff(true)}>
                        <ChatIcon />
                    </IconButton>
                    <IconButton onClick={() => setOption(!option)} ref={anchorRef}>
                        <MoreVertIcon />
                    </IconButton>
                    <Popper open={option} anchorEl={anchorRef.current} placement='bottom-end' transition>
                    {({ TransitionProps }) => (
                        <Grow {...TransitionProps} >
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                            <MenuList id="split-button-menu">
                                <MenuItem>Profile</MenuItem>
                                <MenuItem>Settings</MenuItem>
                                <MenuItem onClick={handleLogout}>Log out</MenuItem>
                            </MenuList>
                            </ClickAwayListener>
                        </Paper>
                        </Grow>
                    )}
                    </Popper>
                </div>
            </div>

            <div className="sidebar__search">
                <div className="sidebar__searchContainer">
                    <SearchOutlined />
                    <input type="text" placeholder="Search or start new chat" />
                </div>
            </div>

            <div className="sidebar__chats">
                <SidebarChat />
                <SidebarChat />
                <SidebarChat />
            </div>
        </div>
    )
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({setContactOnOff}, dispatch)
}

export default connect(null, mapDispatchToProps)(Sidebar)