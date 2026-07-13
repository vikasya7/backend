import { AppError } from "../../utils/AppError.js";
import { hashPassword } from "../../utils/auth.helper.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.helper.js";
import { toUserResponse } from "./auth.mapper.js";
import { authReporisatory } from "./auth.repository.js";
import type { registerUserDTO } from "./auth.schema.js";

export const authService={
    registerUser:async(body:registerUserDTO)=>{
    const {username,email,password}=body

    const existingUser=await authReporisatory.findUserByUsername(username)
    if(existingUser){
        throw new AppError("user already exists",400)
    }

    const existingUserByEmail=await authReporisatory.findUserByEmail(email)
    if(existingUserByEmail){
        if(existingUser){
        throw new AppError("user already exists with this email",400)
        }
    }

     const hashedPassword=await hashPassword(password)
     
     const newUser=await authReporisatory.createUser(
        username,
        email,
        hashedPassword
     )

     const accessToken=generateAccessToken(newUser.id)
     const refreshToken=generateRefreshToken(newUser.id)
     
     await authReporisatory.createRefreshToken({
        token:refreshToken,
        userId:newUser.id,
        expiresAt:new Date(Date.now()+7*24*60*60*1000)
     })

     return {
        user:toUserResponse(newUser),
        accessToken,
        refreshToken
     }

   }
}
