import { userModel } from "../DB/models/user.model.js"




export const checkIfUserExist=async(req,res,next)=>{
    let tags=req.body.tags

    if(!Array.isArray(tags)){
        tags=[tags]
    }


    if(tags?.length){
        const users=await userModel.find({_id:{$in:tags}})
        if(users.length !== tags.length){
            return res.status(404).json({message:'invalid tags'})
        
        }
    }
    next()
}