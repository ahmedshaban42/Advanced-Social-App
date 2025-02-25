
import  jwt  from "jsonwebtoken";

export const generateToken=({data,sk=process.env.JWT_ACCESS_TOKEN_SECRETKEY_LOGIN,options})=>{
    return jwt.sign(data,sk,options)
}

export const verifyToken=({token,sk=process.env.JWT_ACCESS_TOKEN_SECRETKEY_LOGIN})=>{
    return jwt.verify(token,sk)

}