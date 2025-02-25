import { commentModel } from '../../../DB/models/comment.model.js'
import {postModel} from '../../../DB/models/post.model.js'



export const addcomment=async(req,res)=>{
    const {_id:ownerId}=req.loggedinuser
    const {content,tags,onModel}=req.body
    const {commentOnId}=req.params


    const commentobject={
        content,
        ownerId,
        tags
    }

    if(onModel==='post'){
        const post=await postModel.findOne({_id:commentOnId,allowedcomments:true})
        if(!post){
            return res.status(404).json({message:"can not find post"})
        }
    }else if(onModel==='comment'){
        const comment=await commentModel.findById(commentOnId)
        if(!comment){
            return res.status(404).json({message:"can not find comment"})
        }
        
    }

    commentobject.commentOnId=commentOnId
    commentobject.onModel=onModel


    const newcomment=await commentModel.create(commentobject)
    res.status(201). json({message:"done",newcomment})
}







export const getallcomment=async(req,res)=>{
    const comment=await commentModel.find({onModel:'comment'}).populate(
        [
            {
                path:'commentOnId',
                select:'content _id'
            }
        ]
    ).select('content commentOnId onModel _id')
    res.status(201). json({comment})
}

