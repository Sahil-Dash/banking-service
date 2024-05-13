import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongoDb"
import User from "@/lib/mongo_models/users.model"




export async function POST(req: Request){
    try {
        await dbConnect()

        const data = await req.json()
        const {email, password} = data as {email: string, password: string}
        console.log(email,password)

        const user = await User.findOne({email: email})
        if(user){
            if (user.password == password){
                return NextResponse.json({success: true, message: "Login Successfull", user: user})
            }
            return NextResponse.json({success: false, message: "Invalid Credentials"})
        }

        return NextResponse.json({success: false, message: "User not exist"})
    } catch (error) {
        console.log(error)
        return NextResponse.json({success: false, message: "Error Creating User", error: error})

    }
}