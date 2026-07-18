import type { IJwtPayLoad } from "../../types/index.js";
import { AppError } from "../../utils/AppError.js";
import { comparePassword, hashPassword, hashRefreshToken } from "../../utils/auth.helper.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../utils/jwt.helper.js";
import { toUserResponse } from "./auth.mapper.js";
import { authReporisatory } from "./auth.repository.js";
import type { LoginUserDTO, RefreshTokenDTO, registerUserDTO } from "./auth.schema.js";

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

   },
   loginUser:async (body:LoginUserDTO)=>{
      const {email,password}=body
      const user=await authReporisatory.findUserByEmail(email)
      if(!user){
         throw new AppError("user not found",404)
      }

      const isPassword=await comparePassword(password,user.password)
      if(!isPassword){
         throw new AppError("invalid credentials",401)
      }
      const accessToken=generateAccessToken(user.id)
      const refreshToken=generateRefreshToken(user.id)

      const hashedRefreshToken=hashRefreshToken(refreshToken)

      await authReporisatory.createRefreshToken({
         token:hashedRefreshToken,
         userId:user.id,
         expiresAt:new Date(Date.now()+7*24*60*60*1000)
      })


      return {
         user:toUserResponse(user),
         accessToken,
         refreshToken
      }
      
   },

   refreshToken:async(body:RefreshTokenDTO)=>{
      const {token}=body
      if(!token){
         throw new AppError("Refresh token required",401)
      }

      let decoded;
      try {
         decoded=verifyRefreshToken(token) as IJwtPayLoad
      } catch  {
         throw new AppError("Invalid refresh token",401)
      }
       
      const hashedToken=hashRefreshToken(token)
      const existingToken=await authReporisatory.findRefreshToken(hashedToken)
      if(!existingToken){
         throw new AppError("refresh token not found",403)
      }

      await authReporisatory.deleteRefreshTokenById(existingToken.id)
      const newAccessToken=generateAccessToken(decoded.userId)
      const newRefreshToken=generateRefreshToken(decoded.userId)

      const newRefreshTokenHashed=hashRefreshToken(newRefreshToken)

      await authReporisatory.createRefreshToken({
         token:newRefreshTokenHashed,
         userId:decoded.userId,
         expiresAt:new Date(Date.now()+7*24*60*60*1000)
      })

      return {
         accessToken:newAccessToken,
         refreshToken:newRefreshTokenHashed
      }
   },

   getCurrentUser:async(userId:string)=>{
      const user=await authReporisatory.findUserById(userId)
      if(!user){
         throw new AppError("user not found",404)
      }
      return {
         user:toUserResponse(user)
      }
   },


   logout:async(refreshToken:string)=>{
      if(!refreshToken){
         throw new AppError("Refresh Token required",401)
      }
      const refreshTokenHashed=hashRefreshToken(refreshToken)

      const existingToken=await authReporisatory.findRefreshToken(refreshTokenHashed)

      if(!existingToken){
         throw new AppError("Invalid refresh Token",404)
      }

      await authReporisatory.deleteRefreshTokenById(existingToken.id)

      return true
   },

   logoutAllDevices:async(userId:string)=>{
      if(!userId){
         throw new AppError("User not authenticated",404)
      }
      await authReporisatory.deleteAllRefreshTokenByUser(userId)
      return true
   }

}
