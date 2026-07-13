import type { User } from "../../../generated/prisma/client.js";
import type { IUserResponse } from "../../types/index.js";
import type { UserResponseDTO } from "./auth.response.js";




export const toUserResponse=(user:IUserResponse)=>{
    return {
        id:user.id,
        username:user.username,
        email:user.email,
        createdAt:user.createdAt,
        updatedAt:user.updatedAt
    }
}