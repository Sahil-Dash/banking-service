import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongoDb"
import User from "@/lib/mongo_models/users.model"

export async function POST(req: Request){
    try {
        await dbConnect()

        const data = await req.json()
        const {email, password, firstName, lastName} = data as {email: string, password: string, firstName: string, lastName: string}
        console.log(email,password,firstName,lastName)

        const user = await User.findOne({email: email})
        if(user){
            return NextResponse.json({success: false, message: "user already exists"})
        }

        const newUser = new User({email: email, password:password, firstName: firstName, lastName: lastName})
        await newUser.save()

        console.log(newUser)

        return NextResponse.json({success: true, message: "User Created Successfully"})
    } catch (error) {
        console.log(error)
        return NextResponse.json({success: false, message: "Error Creating User", error: error})

    }
}