import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError.js";
import { verifyAccessToken } from "../utils/jwt.helper.js";
import type { JwtPayload } from "jsonwebtoken";
import type { IJwtPayLoad } from "../types/index.js";
import { authReporisatory } from "../modules/auth_modules/auth.repository.js";

export const verifyUser=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const token=req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer","").trim()

        if(!token){
            throw new AppError("Unauthorized request",401)
        }

        const decoded=verifyAccessToken(token) as IJwtPayLoad
        const user=await authReporisatory.findUserById(decoded.userId)

        if(!user){
            throw new AppError("Unauthorized request",401)
        }
        req.userId=user.id
        next()

    } catch (error) {
        next(new AppError("Invalid or exired token",401))
    }
}