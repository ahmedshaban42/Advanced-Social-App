
import { Reacts } from "../../../constants/constants.js"
import { reactModel } from "../../../DB/models/reacts.model.js"
import {postModel} from '../../../DB/models/post.model.js'
import {commentModel}from '../../../DB/models/comment.model.js'



export const addreact=async(req,res)=>{
    const {_id:ownerId}=req.loggedinuser
    const {reactOnId}=req.params
    const {onModel,reactType}=req.body


    if(onModel==='post'){
        const post=await postModel.findById(reactOnId)
        if(!post){
            return res.status(404).json({message:"can not find post"})
        }
    }else if(onModel==='comment'){
        const comment=await commentModel.findById(commentOnId)
        if(!comment){
            return res.status(404).json({message:"can not find comment"})
        }
    }


    const reacts=Object.values(Reacts)
    if(!reacts.includes(reactType)){
        return res.status(404).json({message:"invalid react"})
    }

    const react=await reactModel.create({
        ownerId,
        onModel,
        reactOnId,
        reactType
    })

    res.status(201).json({react})
}


export const deletereact=async(req,res)=>{
    const {_id:ownerId}=req.loggedinuser
    const {reactId}=req.params

    const deletereact=await reactModel.findByIdAndDelete(
        {
            _id:reactId,
            ownerId
        }
    )
    if(!deletereact){
        return res.status(404).json({message:"can not find react"})
    }
    res.status(200).json({message:"done"})
}