import multer from "multer";
import fs from 'fs'


export const Multer=(distenationpath='general',allowextentions=[])=>{
    const destanationfolder=`Assets/${distenationpath}`
    if(!fs.existsSync(destanationfolder)){
        fs.mkdirSync(destanationfolder,{recursive:true})
    }

    const storage=multer.diskStorage({
        destination:function(req,file,cb){
            cb(null,destanationfolder)
        },
        filename:function(req,file,cb){

            const uniqueSuffix=Date.now()+'-'+Math.round(Math.random()*1E9)
            cb(null,uniqueSuffix +'__'+ file.originalname)
        }

    })

    const fileFilter =(req,file,cb)=>{
        if(allowextentions.includes(file.mimetype)){
            cb(null,true)
        }else{
            cb(new Error('invalid file type'),false)
        }

    }


    const uplode=multer(({fileFilter,storage }))
    return uplode

}