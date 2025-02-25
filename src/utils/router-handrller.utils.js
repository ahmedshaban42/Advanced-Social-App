import usercontroller from '../Modules/user/user.controller.js'
import authRoterUser from '../Modules/Auth/auth-user/auth-user.controller.js'
import {globalhandelrMW} from '../Middleware/error-handeller.middleware.js'
import commentcontroller from '../Modules/comment/comment.controller.js'
import postController from '../Modules/posts/post.controller.js'
import reactController from '../Modules/reacts/react.controller.js'
import {rateLimit}from 'express-rate-limit'

const limit=rateLimit({
    windowMs:15*60*1000,
    limit:1000,
    message:'to many request',
    legacyHeaders:false
})




const routerhandellar=(app,express)=>{
    app.use(limit)
    app.use('/Assets',express.static('Assets'))


    app.use('/auth-user',authRoterUser)
    app.use('/user',usercontroller)

    app.use('/comment',commentcontroller)



    app.use('/posts',postController)
    app.use('/react',reactController)







    app.use(globalhandelrMW)
}


export default routerhandellar