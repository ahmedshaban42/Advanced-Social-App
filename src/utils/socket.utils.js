import { Socket } from 'socket.io'
import {validateusertoken}from '../Middleware/authentication.middleware.js'
import { sendMessage } from '../Modules/user/services/chat.service.js'

export const socketconnection=new Map()


export const regesterSocketId=async(handshake,id)=>{

    const accesstoken=handshake.auth.accesstoken

    const {user}= await validateusertoken(accesstoken)

    socketconnection.set(user?._id?.toString(),id)

    console.log('socket connected',socketconnection)

    return 'socket connected successfuly'

}


export const removeSocketId=async(Socket)=>{
    const accesstoken=Socket.handshake.auth.accesstoken
    const {user}= await validateusertoken(accesstoken)
    socketconnection.delete(user?._id?.toString())
    console.log('socket disconnect',socketconnection)

    return 'socket disconnect successfuly'
}


export const establishIoconecction=(io)=>{
    
    io.on('connection',async(Socket)=>{

        await regesterSocketId(Socket.handshake,Socket.id)
        await sendMessage(Socket)

    
    })
}












