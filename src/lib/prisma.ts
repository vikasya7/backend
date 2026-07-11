import { PrismaClient } from "@prisma/client/extension";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { DATABASE_URL } from "../config/config.js";



const connectionString=`${DATABASE_URL}`
const adapter=new PrismaPg({connectionString})

const prisma=new PrismaClient({adapter})
export {prisma}