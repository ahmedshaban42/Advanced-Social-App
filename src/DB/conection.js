
import mongoose from "mongoose";
export const connection=async()=>{
    try{
        await mongoose.connect(process.env.DB_URL)
        console.log('DB CONNECTED')

    }catch(error){
        console.log('error in DB connection',error)

    }
} 