

import mongoose from "mongoose";


const commentSchema=new mongoose.Schema({

    content:String,
    ownerId:{type:mongoose.Schema.Types.ObjectId,ref:'user',require:true},
    tags:[{type:mongoose.Schema.Types.ObjectId,ref:'user'}],//mentions
    images:{
        URL:[{
            secure_URL:String,
            public_id:String
        }],
        folderId:String
    },
    commentOnId:{
        type:mongoose.Schema.Types.ObjectId,
        refPath:'onModel',
        required:true
    },
    onModel:{
        type:String,
        enum:['post','comment']
    }


},
{
    timestamps:true
})

export const commentModel=mongoose.models.comment || mongoose.model('comment',commentSchema)