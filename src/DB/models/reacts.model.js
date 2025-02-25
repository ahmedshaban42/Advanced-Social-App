
import mongoose from "mongoose";
import { Reacts } from "../../constants/constants.js";


const reactSchema=new mongoose.Schema({

    reactOnId:{
            type:mongoose.Schema.Types.ObjectId,
            refPath:'onModel',
            required:true
        },
        onModel:{
            type:String,
            enum:['post','comment']
        },
        ownerId:{type:mongoose.Schema.Types.ObjectId,ref:'user',require:true},
        reactType:{
            type:String,
            enum:Object.values(Reacts)
        }

},
{
    timestamps:true
})

export const reactModel=mongoose.models.react||mongoose.model('react',reactSchema)

