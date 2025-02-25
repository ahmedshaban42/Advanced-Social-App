import { Router } from "express";
const user=Router()
import { uplodeprofilepicture,uplodecoverpicture,addPost,listAllPost,sendFriendRequest,AcceptFriendRequestService,listFriendsService } from "./services/user.service.js";
import { errorHandler } from "../../Middleware/error-handeller.middleware.js";
import { Multer } from "../../Middleware/multer.middleware.js";
import { ImageExtensions } from "../../constants/constants.js";
import {authenticationMiddleware,authorizationMiddleware}from '../../Middleware/authentication.middleware.js'
import { checkIfUserExist } from "../../Middleware/check-user.middlware.js";
import {GetChatHistoryService}from './services/chat.service.js'



user.post('/uplod-profile-picture',
    authenticationMiddleware(),
    Multer('user/profile',ImageExtensions).single('images'),
    errorHandler(uplodeprofilepicture))

user.post('/uplod-cover-picture',
    authenticationMiddleware(),
    Multer('user/covers',ImageExtensions).array('covers',3),
    errorHandler(uplodecoverpicture))


user.post('/create-post',
    errorHandler(authenticationMiddleware()),
    checkIfUserExist,
    errorHandler(authorizationMiddleware('user')),
    errorHandler(addPost)
)


user.get('/get-all-post',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware('user')),
    errorHandler(listAllPost)
)

user.post('/send-frind-request/:requestToId',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware('user')),
    errorHandler(sendFriendRequest)
)

user.post('/Accept-Friend-Request-Service/:requestFromId',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware('user')),
    errorHandler(AcceptFriendRequestService)
)


user.get('/list-friends',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware('user')),
    errorHandler(listFriendsService)
)


user.get('/get-chat-history/:receiverId',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware('user')),
    errorHandler(GetChatHistoryService)
)

export default user