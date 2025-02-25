import { Router } from "express";

const postController=Router()
import {authenticationMiddleware,authorizationMiddleware}from '../../Middleware/authentication.middleware.js'
import { errorHandler } from "../../Middleware/error-handeller.middleware.js";
import { getAllPosts } from "./services/post.service.js";



postController.get('/get-all-posts',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware('user')),
    errorHandler(getAllPosts)
)






export default postController