import React, { useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'
import { baseURL } from '../axios'

const SocketContext = React.createContext()

export function useSocket() {
    return useContext(SocketContext)
}

export function SocketProvider({ id, children }) {
    const [socket, setSocket] = useState()

    useEffect(() => {
        const newSocket = io(
            baseURL,
            { query: { id } }
        )
        setSocket(newSocket)

        return () => newSocket.close()
    }, [id])                                                // Jalankan useeffect setiap ada perubahan pada params id

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}