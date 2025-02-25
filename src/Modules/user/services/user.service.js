import { postModel } from "../../../DB/models/post.model.js"
import { userModel } from "../../../DB/models/user.model.js"
import {requestsModel}from '../../../DB/models/requests.model.js'
import { friendsModel } from "../../../DB/models/friends.model.js"









export const uplodeprofilepicture = async (req, res) => {
    const {_id}=req.loggedinuser

    const {file}=req
    console.log(file)
    if(!file){
        return res.status(400).json({message:'no file uploaded'})
    }
    const url =`${req.protocol}://${req.headers.host}/${file.path}`

    const user=await userModel.findByIdAndUpdate(_id,{profilepicture:url},{new:true})

    res.status(200).json({message:' profile picture uploaded susseccfully',user})

}   




export const uplodecoverpicture = async (req, res) => {
    const {_id}=req.loggedinuser

    const {files}=req
    if(!files?.length){
        return res.status(400).json({message:'no file uploaded'})
    }
    const images=files.map(files=>`${req.protocol}://${req.headers.host}/${files.path}`)

    const user=await userModel.findByIdAndUpdate(_id,{coverpicture:images},{new:true})

    res.status(200).json({message:' profile picture uploaded susseccfully',user})

}  




export const addPost=async(req,res)=>{
    const {_id:ownerId}=req.loggedinuser
    const {title,description,tags,allowedcomments}=req.body

    const postobject={
        title,
        description,
        allowedcomments,
        ownerId,
        tags
    }

    
    //check image by cloudnarry

    const post =await postModel.create(postobject)
    res.status(201).json({message:'post create successfully',post})
}


export const listAllPost=async(req,res)=>{
    const posts=await postModel.find().populate(
        [
            {
                path:'ownerId',
                select:'username'
            }
        ]
    )
    res.status(200).json({posts})

}




export const sendFriendRequest=async(req,res)=>{
    const {_id}=req.loggedinuser 
    const {requestToId}=req.params

    const user=await userModel.findById(requestToId)
    if(!user){
        return res.status(404).json({message:'user not found'})
    }
    let requset=null

    const requestExists=await requestsModel.findOne({requestedBy:_id})
    if(requestExists){

        const allreadySend=requestExists.pending.includes(requestToId)
        if(allreadySend){
            return res.status(404).json({message:'request allready exists'})
        }

        requestExists.pending.push(requestToId)
        requset=await requestExists.save()

    }else{
        const newrequest=new requestsModel({
            requestedBy:_id,
            pending:[requestToId]
        })
        requset=await newrequest.save()
    }

    return res.status(201).json({message:'send friend request done',requset})

}


export const AcceptFriendRequestService = async (req, res, next) => {
    
    const { _id } = req.loggedinuser;  
    const { requestFromId } = req.params;

    const request = await requestsModel.findOneAndUpdate(
        { requestedBy: requestFromId, pending: { $in: [_id] }},
        { $pull: { pending: _id } },
        { new: true }
    );

    if (!request) {
        return res.status(404).json({ message: 'Request not found' });
    }

    
    const userFriends = await friendsModel.findOneAndUpdate(
        { userId: _id },
        { $addToSet: { friends: requestFromId } },
        { new: true, upsert: true }
    );

    
    const friendFriends = await friendsModel.findOneAndUpdate(
        { userId: requestFromId },
        { $addToSet: { friends: _id } },
        { new: true, upsert: true }
    );

    return res.status(200).json({
        message: 'Friend request accepted successfully',
        userFriends,
        friendFriends
    });
};




export const listFriendsService = async (req, res, next) => {

        const { _id ,username} = req.loggedinuser;

    
        const friendsRecord = await friendsModel.findOne({ userId: _id })
            .populate({
                path: 'friends',
                select: 'username' 
            });


        return res.status(200).json({
            message: 'Friends list fetched successfully',
            friends: friendsRecord,
            user:{ _id ,username}
        });
};
