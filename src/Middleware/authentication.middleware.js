import jwt from 'jsonwebtoken'
//import { blacklistmodel } from '../DB/models/black_list_tokens_models.js'
import { userModel } from '../DB/models/user.model.js'
import { verifyToken } from '../utils/token.utils.js'



export const validateusertoken=async(accesstoken)=>{

        const decodeddata=verifyToken({token:accesstoken,sk:process.env.JWT_ACCESS_TOKEN_SECRETKEY_LOGIN})

        // const isblacklistedtoken=await blacklistmodel.findOne({tokenid:decodeddata.jti})
            // if(isblacklistedtoken){
            //     return res.status(400).json({message:'plasse login frist'})
            // }

            const user=await userModel.findById(decodeddata._id,'-password -__v')
            if(!user){
                throw new Error("User not found, please sign up");
            }
            return {user,token:{tokenid:decodeddata.jti,expirydata:decodeddata.exp}}

}













export const authenticationMiddleware=()=>{
    return async(req,res,next)=>{
        
            const {accesstoken}=req.headers
            if(!accesstoken){
                return res.status(400).json({message:'plasse enter access token'})
            }
            const decodeddata=jwt.verify(accesstoken,process.env.JWT_ACCESS_TOKEN_SECRETKEY_LOGIN)

            // const isblacklistedtoken=await blacklistmodel.findOne({tokenid:decodeddata.jti})
            // if(isblacklistedtoken){
            //     return res.status(400).json({message:'plasse login frist'})
            // }

            const user=await userModel.findById(decodeddata._id,'-password -__v')
            if(!user){
                return res.status(400).json({message:'user not found plase signUp'})
            }

            req.loggedinuser=user
            req.userToken={tokenid:decodeddata.jti,expirydata:decodeddata.exp}
            next()
        
    }
}

export const authorizationMiddleware=(allowroles)=>{
    return async(req,res,next)=>{
        
            const {role}=req.loggedinuser
            const isrloeallowed=allowroles.includes(role)
            if(!isrloeallowed){
                return res.status(409).json({message:'unauthorized'})
            }
            next()
        
    }
}