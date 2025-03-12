import db from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcrypt"
import { createSession } from "../../../lib/session"


export  async function POST(request: NextRequest){
    const router =useRouter()
    try {
     const {name,email,password,role}=await request.json()
    //  check if the user is already exists in db
    
    const existingUser =await db.user.findUnique({
        where:{
            email,
        }
    })
    if(existingUser){
        return NextResponse.json({
            data:null,
            massege:"User already exists"
        },{status:409})
    }
    // Encrypt yhe password => bcrypt
    const hashedPassword =await bcrypt.hash(password,10)
    const newUser =await db.user.create({
        data:{
            name,
            email,
            password: hashedPassword,
            role
        }
    });
    console.log(newUser)
     await createSession(newUser)
    return NextResponse.json({
        data:newUser,
        message: "user Created Successfully"
    },
{status:201});
    } catch (error) {
     console.log(error)
     return NextRequest.json({
        error,
        message:"Server Error:Something went wrong",
     },
     {status:500}); 
    }
}


export async function GET(request){
    try{
    const users = await db.user.findMany({
      orderBy:{
          createdAt:"desc"
      },
  },);
    return NextResponse.json(users)
    } catch (error) {
  console.log(error)
  return NextResponse.json({
      message:"failed to fetch users",error
  },{status:500})
    }
  }
