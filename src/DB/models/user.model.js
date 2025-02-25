import mongoose from "mongoose";
import { genders, systemrRoles,providers } from "../../constants/constants.js";


const userschema=new mongoose.Schema(
    {
        username:{
            type:String,
            require:[true,'user name is require'],
            lowercase:true,
            trim:true,
            minLength:[3,'name must be grater then 3 '],
            maxlength:[20,'name must be less than 20']
        },
        email:{
            type:String,
            require:[true,'email is require'],
            unique:[true,'email is already taken'],
        },
        password:{
            type:String,
            require:[true,'password is require'],
        },
        phone:{
            type:String,
            require:[true,'phone number is require'],
        },
        isDeactivited:{
            type:Boolean,
            default:false
        },
        isVerified:{
            type:Boolean,
            default:false
        },
        profilepicture:String,
        coverpicture:[String],
        confirmotp:String,
        forgetOtp:String,
        role:{
            type:String,
            default:systemrRoles.User,
            enum:Object.values(systemrRoles)
        },
        isPublic:{
            type:Boolean,
            default:true
        },
        DOB:Date,
        gender:{
            type:String,
            default:genders.NOTSPECIFIDE,
            enum:Object.values(genders)
        },
        provider:{
            type:String,
            default:providers.SYSTEM,
            enum:Object.values(providers)
        },
        otpExpiresAt:Date




    },
    {timestamps:true}
)
export const userModel=mongoose.model.user||mongoose.model('user',userschema)
