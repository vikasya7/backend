import type { NextFunction, Request, Response } from "express";
import type {z, ZodObject } from "zod";

export const validate=(schema:ZodObject)=>(req:Request,res:Response,next:NextFunction)=>{
     const result=schema.safeParse(req.body)

     if(!result.success){
        const errors=result.error.issues.map((err)=>({
            field: err.path.join("."),
            message: err.message
        }))
        return res.status(400).json({
            message:"Validation Failed",
            errors
        })
     }
     req.body=result.data
     
     next()
}