
import mongoose from "mongoose";
import mongossepaginate from 'mongoose-paginate-v2'

const postSchema=new mongoose.Schema({

    title:{type:String,require:true},
    description:String,
    ownerId:{type:mongoose.Schema.Types.ObjectId,ref:'user',require:true},
    tags:[{type:mongoose.Schema.Types.ObjectId,ref:'user'}],
    allowedcomments:{type:Boolean,default:true},
    images:{
        URL:[{
            secure_URL:String,
            public_id:String
        }],
        folderId:String
    }

},
    {
        timestamps:true,
        toJSON:{
            virtuals:true,
        },
        toObject:{
            virtuals:true
        }
    }
)

postSchema.virtual('commentData',{
    ref:'comment',
    localField:'_id',
    foreignField:'commentOnId'
})
postSchema.plugin(mongossepaginate)

export const postModel=mongoose.models.post || mongoose.model('post',postSchema)