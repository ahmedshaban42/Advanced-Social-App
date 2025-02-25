import { Router } from 'express'
import{signUpService,confirmEmail,signInUser,gamilsignIn,gmailRegister,resendOtp}from './services/authentication-user.service.js'
import {errorHandler}from '../../../Middleware/error-handeller.middleware.js'
const authRoterUser=Router()

authRoterUser.post('/signUp-user',errorHandler(signUpService))
authRoterUser.put('/confirm-email',errorHandler(confirmEmail))
authRoterUser.post('/user-login',errorHandler(signInUser))

authRoterUser.post('/gmail-login',errorHandler(gamilsignIn))

authRoterUser.post('/gmail-signup',errorHandler(gmailRegister))
authRoterUser.post('/resend-otp',errorHandler(resendOtp))










export default authRoterUser