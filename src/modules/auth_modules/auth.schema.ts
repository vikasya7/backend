import {z} from "zod"

export const registerUserSchema=z.object({
    username:z.string().min(3,"Username must be atleast  3 characters long"),
    email:z.email("Email is required"),
    password:z.string().min(6,"password must be 6 characters long")
})

export type registerUserDTO=z.infer<typeof registerUserSchema>