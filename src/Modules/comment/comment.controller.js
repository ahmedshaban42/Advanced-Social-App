import { Router } from "express";
import{addcomment,getallcomment}from './services/comment.service.js'
import {authenticationMiddleware,authorizationMiddleware}from '../../Middleware/authentication.middleware.js'
import { errorHandler } from "../../Middleware/error-handeller.middleware.js";
import {checkIfUserExist}from '../../Middleware/check-user.middlware.js'


const commentcontroller=Router()


commentcontroller.post('/addcomment/:commentOnId',
    errorHandler(authenticationMiddleware()),
    checkIfUserExist,
    errorHandler(authorizationMiddleware('user')),
    errorHandler(addcomment)
)

commentcontroller.get('/get-all-comment',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware('user')),
    errorHandler(getallcomment)
)



export default commentcontroller