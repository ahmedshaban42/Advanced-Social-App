import express from 'express'

import { connection } from './DB/conection.js'

import path from 'path'
import { config } from 'dotenv'
config({path:path.resolve(`src/config/.${process.env.NODE_ENV}.env`)})
console.log(path.resolve(`src/config/.${process.env.NODE_ENV}.env`))

import routerhandellar from './utils/router-handrller.utils.js'
import cors from 'cors'

import { Server } from 'socket.io'

import {establishIoconecction} from './utils/socket.utils.js'

const whitelist = [process.env.FRONTEND_ORIGIN,'http://127.0.0.1:5501']

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.includes(origin)) {
            callback(null, true);
        } else {
            console.log(`Blocked CORS request from: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    }
};


const bootstrab=()=>{
    const app=express()
    const port=process.env.PORT
    connection()
    app.use(express.json())
    
    app.use(cors(corsOptions))
    routerhandellar(app,express)



    const server=app.listen(process.env.PORT,()=>{
        console.log(`server work in port ${port} successfuly` )
    })

    const io=new Server(server,{
        cors:{
            origin:"http://127.0.0.1:5501"
        }
    })
    establishIoconecction(io)


}
export default bootstrab