import { compareSync, hashSync } from "bcrypt"
import { userModel } from "../../../../DB/models/user.model.js"
import {Decryption,Encryption} from '../../../../utils/encryption.utils.js'
import {emitter} from '../../../../Services/sent-email.service.js'
import { generateToken,verifyToken } from "../../../../utils/token.utils.js"
import {v4 as uuidv4}from 'uuid'
import { OAuth2Client } from "google-auth-library"
import { providers } from "../../../../constants/constants.js"


export const signUpService=async(req,res,next)=>{
    const {username,email,DOB,gender,password,phone,privataccount}=req.body

    const isEmailfound =await userModel.findOne({email})
    if(isEmailfound){
        return res.status(400).json({message:'email is already exists'})
    }

    const hashpassword=hashSync(password,+process.env.SALT)


    const encryptionPhone=await Encryption({value:phone,secretkey:process.env.ENCRYPTED_KEY_PHONE})


    const isPublic=privataccount?false:true

    const otp=Math.floor(100000+Math.random()*900000).toString()
    const hashOtp=hashSync(otp,+process.env.SALT)
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    emitter.emit('sendEmail',{
        subject:'confirm your email',
        html:`<h1>${otp}</h1>`,
        to:email,
    })

    const user=new userModel({
        username,
        email,
        DOB,
        gender,
        password:hashpassword,
        phone:encryptionPhone,
        isPublic,
        confirmotp:hashOtp,
        otpExpiresAt:otpExpires
    })
    await user.save()

    res.status(201).json({message:'signUp susseccfuly'})

}


export const confirmEmail=async(req,res)=>{
    const {otp,email}=req.body

    const user =await userModel.findOne({email,isVerified:false,confirmotp:{$exists:true}})
    if(!user){
        return res.status(400).json({message:'user not found '})
    }
    if (new Date() > user.otpExpiresAt) {
    return res.status(400).json({ message: "OTP has expired, request a new one" });
}

    const validotp=compareSync(otp,user.confirmotp)
    if(!validotp){
        return res.status(400).json({message:'invalid otp'})
    }

    await userModel.findByIdAndUpdate(user._id,{isVerified:true,$unset:{confirmotp:'',otpExpiresAt:''}})

    res.status(200).json({message:'confirm email successfully'})
}

export const resendOtp=async(req,res)=>{
    const {email}=req.body
    const user =await userModel.findOne({email,isVerified:false,confirmotp:{$exists:true}})
    if(!user){
        return res.status(400).json({message:'user not found'})
    }
    if (user.otpExpiresAt && new Date() < user.otpExpiresAt) {
        return res.status(400).json({ message: "OTP already sent. Please wait before requesting a new one." });
    }
    const otp=Math.floor(100000+Math.random()*900000).toString()
    const hashOtp=hashSync(otp,+process.env.SALT)
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    await userModel.findByIdAndUpdate(user._id,{confirmotp:hashOtp,otpExpiresAt:otpExpires})
    emitter.emit('sendEmail',{
        to:user.email,
        subject:'confirm your email',
        html:`<h1>${otp}</h1>`,
    })
    res.status(201).json({message:'otp send susseccfuly'})
}


export const signInUser=async(req,res)=>{

    const {email,password}=req.body
    const user=await userModel.findOne({email})
    if(!user){
        return res.status(400).json({message:'email or password not valid'})
    }

    const ispassword=compareSync(password,user.password)
    if(!ispassword){
        return res.status(400).json({message:'email or password not valid'})
    }
    const accesstoken=generateToken({
        data:{_id:user._id,role:user.role,username:user.username},
        sk:process.env.JWT_ACCESS_TOKEN_SECRETKEY_LOGIN,
        options:{expiresIn:process.env.JWT_ACCESS_TOKEN_EXP_LOGIN,jwtid:uuidv4()}
    })

    const refreshtoken=generateToken({
        data:{_id:user._id,role:user.role,username:user.username},
        sk:process.env.JWT_REFRESH_TOKEN_SECRETKEY_LOGIN,
        opoptions:{expiresIn:process.env.JWT_REFRESH_TOKEN_EXP_LOGIN,jwtid:uuidv4()}
    })
    res.status(200).json({message:'login susseccfully',accesstoken,refreshtoken})


}



export const gmailRegister=async(req,res)=>{
    const {idToken}=req.body
    const client=new OAuth2Client()
    const ticket=await client.verifyIdToken({idToken:idToken,audience:process.env.CLIENTTD_GOOGLE})
    const payload=ticket.getPayload()
    const {email_verified,email,name}=payload
    if(!email_verified){
        return res.status(400).json({message:'invalid gmail credentials'})
    }
    

    const user=await userModel.findOne({email})
    if(user){
        return res.status(400).json({message:'user is already exist'})
    }

    const newUser=new userModel({
        username:name,
        email,
        provider:providers.GOOGLE,
        isVerified:true,
        password:hashSync(uuidv4(),+process.env.SALT)
    })
    await newUser.save()
    res.status(201).json({message:'signUp susseccfuly'})



}



export const gamilsignIn=async(req,res)=>{
    const {idToken}=req.body
    const client=new OAuth2Client()
    const ticket=await client.verifyIdToken({idToken:idToken,audience:process.env.CLIENTTD_GOOGLE})
    const payload=ticket.getPayload()
    const {email_verified,email}=payload
    if(!email_verified){
        return res.status(400).json({message:'invalid gmail credentials'})
    }
    const user =await userModel.findOne({email,provider:providers.GOOGLE})
    if(!user){
        return res.status(400).json({message:'user is not found'})
    }

    const accesstoken=generateToken({
        data:{_id:user._id},
        sk:process.env.JWT_ACCESS_TOKEN_SECRETKEY_LOGIN,
        options:{expiresIn:process.env.JWT_ACCESS_TOKEN_EXP_LOGIN,jwtid:uuidv4()}
    })

    const refreshtoken=generateToken({
        data:{_id:user._id},
        sk:process.env.JWT_REFRESH_TOKEN_SECRETKEY_LOGIN,
        opoptions:{expiresIn:process.env.JWT_REFRESH_TOKEN_EXP_LOGIN,jwtid:uuidv4()}
    })
    res.status(200).json({message:'login susseccfully',tokens:{accesstoken,refreshtoken}})


}







