
import { postModel } from "../../../DB/models/post.model.js"


//جبت كل البوست ب الكومنتات الي عليها بصحاب كل كومينت
export const getAllPosts=async(req,res)=>{
    const post=await postModel.find().populate({

        path:'commentData',
        select:'content',
        populate:[{
            path:'ownerId',
            select:'username'
        }]

    }
    )
    res.status(200).json({post})
}


// export const getAllPosts=async(req,res)=>{
//     const {limit,page}=req.query
//     const post=await postModel.paginate({},
//         {
//             limit,
//             page,
            

//         })
    
//     res.status(200).json({post})
// }