
import mongoose from "mongoose";



const requestsSchema=new mongoose.Schema(
    {
        requestedBy:{type:mongoose.Schema.Types.ObjectId,ref:'user',required:true},
        pending:[{type:mongoose.Schema.Types.ObjectId,ref:'user',required:true}]
    },
    {
        timestamps:true
    })
    

    export const requestsModel=mongoose.models.Requests||mongoose.model('Requests',requestsSchema)