import React, { Children, createContext, useContext, useMemo } from 'react'
import { io, Socket } from 'socket.io-client';

interface SocketContextProps {
    socket: Socket
}

const SocketContext = createContext<SocketContextProps | null>(null);

export const useSocket = () => {
    const socket = useContext(SocketContext);
    if (!socket) return;
    return socket.socket;
}

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const socket = useMemo<Socket>(() => {
        return io(`${process.env.RUN_MODE === "dev" ? "http://localhost:8001" : `wss://${process.env.NEXT_PUBLIC_SOCKET_URL}`}}`, {
            path: "/socket.io",
            transports: ["websocket"],
            secure: true,
        })
    }, [])
    return (
        <div>
            <SocketContext.Provider value={{ socket }}>
                {children}
            </SocketContext.Provider>
        </div>
    )
}

export default SocketProvider