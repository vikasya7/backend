import express, { type Request, type Response } from "express"
import cookieParser from 'cookie-parser'
import { FRONTEND_URL } from "./config/config.js"
import cors from 'cors'
import { globalErrorHandler } from "./middlewares/error.middleware.js"
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
import authRouter from "./modules/auth_modules/auth.route.js"

app.use("/api/v1/auth",authRouter)
app.use(globalErrorHandler)