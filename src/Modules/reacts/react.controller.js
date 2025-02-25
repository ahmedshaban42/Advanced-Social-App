import { Router } from "express";

const reactController=Router()
import {authenticationMiddleware,authorizationMiddleware}from '../../Middleware/authentication.middleware.js'
import { errorHandler } from "../../Middleware/error-handeller.middleware.js";
import {addreact,deletereact}from './services/react.service.js'





reactController.post('/add-react/:reactOnId',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware('user')),
    errorHandler(addreact)
)


reactController.delete('/delete-react/:reactId',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware('user')),
    errorHandler(deletereact)
)

export default reactController