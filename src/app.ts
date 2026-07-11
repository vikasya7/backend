import express, { type Request, type Response } from "express"
import cookieParser from 'cookie-parser'
import { FRONTEND_URL } from "./config/config.js"
import cors from 'cors'
export const app=express()


app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:FRONTEND_URL,
}))


app.get("/healthCheck",(req:Request,res:Response)=>{
    return res.status(200).json({
        success:true,
        message:"api is working fine"
    })
})