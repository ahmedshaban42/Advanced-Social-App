import { chatmodel } from "../../../DB/models/chat.model.js"
import { validateusertoken } from "../../../Middleware/authentication.middleware.js"
import {socketconnection}from '../../../utils/socket.utils.js'



export const GetChatHistoryService = async (req, res, next) => {

    const { _id } = req.loggedinuser
    const { receiverId } = req.params

    const chat = await chatmodel.findOne(
        {
            $or: [
                { senderId: _id, receiverId },
                { receiverId: _id, senderId: receiverId }
            ]
        }
    ).populate([
        {
            path: 'senderId',
            select: 'username profilePicture'
        },
        {
            path: 'receiverId',
            select: 'username profilePicture'
        },
        {
            path: 'messages.senderId',
            select: 'username profilePicture'
        }
    ])

    return res.status(200).json({ message: 'Chat history fetched successfully', chat })
}



export const sendMessage=async(Socket)=>{

    return Socket.on('sendMessage',async(message)=>{
        const loggedinuser=await validateusertoken(Socket.handshake.auth.accesstoken)
        const {receiverId,body}=message

        let chat=await chatmodel.findOneAndUpdate(
            {
                $or:[
                    {senderId:loggedinuser.user._id,receiverId},
                    {receiverId:loggedinuser.user._id,senderId:receiverId}
                ]
            },
            {
                $addToSet:{
                    messages:{
                        body,
                        senderId:loggedinuser.user._id
                    }
                }
            }
        )

        if(!chat){
            chat=new chatmodel({
                senderId:loggedinuser.user._id,
                receiverId,
                messages:[{
                    body,
                    senderId:loggedinuser.user._id
                }]
            })
            chat=await chat.save()
        }

        Socket.emit('successMessage',{body,chat})
        const receiverSocket=socketconnection.get(receiverId.toString())

        Socket.to(receiverSocket).emit('receiveMessage',{body})
    })
}