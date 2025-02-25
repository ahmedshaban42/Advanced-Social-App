
import mongoose from "mongoose";



const friendsSchema=new mongoose.Schema(
    {
        userId:{type:mongoose.Schema.Types.ObjectId,ref:'user',required:true},
        friends:[{type:mongoose.Schema.Types.ObjectId,ref:'user',required:true}]
    },
    {
        timestamps:true
    })
    

    export const friendsModel=mongoose.models.friends||mongoose.model('friends',friendsSchema)