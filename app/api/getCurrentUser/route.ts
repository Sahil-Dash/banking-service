import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongoDb"
import User from "@/lib/mongo_models/users.model"
import Dwolla from "@/lib/mongo_models/dwolla.models"

export async function POST(req: Request){
    try {
        await dbConnect()

        const data = await req.json()
        const {email} = data as {email: string}

        const user = await Dwolla.findOne({email: email})
        if(user){
            return NextResponse.json({success: true, message: "user found exists", user: user})
        }

        return NextResponse.json({success: false, message: " user not found"})
    } catch (error) {
        console.log(error)
        return NextResponse.json({success: false, message: "Error getting User", error: error})

    }
}