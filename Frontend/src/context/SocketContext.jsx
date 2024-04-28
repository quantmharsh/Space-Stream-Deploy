import  {createContext  , useContext, useEffect, useState} from  'react'
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import io  from "socket.io-client"
const SocketContext= createContext();
export const useSocket= ()=>{
    return useContext(SocketContext)
}
export const SocketContextProvider=({children})=>{
    const user= useRecoilValue(userAtom)
    const[socket ,setSocket]=useState(null)
    const[onlineUsers , setOnlineUsers]=useState([])
    useEffect(() => {
        const socket= io("http://localhost:5000" , {
            query:{
                userId: user?._id
            }
        })
        // handling connection
        setSocket(socket)
        // listen for events both in client and server
        
        socket.on("getOnlineUsers" ,(users)=>{
            setOnlineUsers(users);

        } )

        //handling disconnection

        return()=> socket && socket.close();


     
    }, [ user?._id ])
    console.log(onlineUsers , " online users")
    

    return (
        <SocketContext.Provider  value={{socket , onlineUsers}}>
            {children}
        </SocketContext.Provider>


    )

}