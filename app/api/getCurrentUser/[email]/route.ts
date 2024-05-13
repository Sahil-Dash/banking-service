import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongoDb"
import User from "@/lib/mongo_models/users.model"
import { NextApiRequest } from "next";

export async function GET(req:any) {
    try {
        // const { email } = req.body;
        const email = req.params

        await dbConnect()

        console.log("Got email :-",email)

        const user = await User.findOne({ email: email })
        if (user) {
            return NextResponse.json({ success: true, message: "Found User", user: user })
        }

        return NextResponse.json({ success: false, message: "User not Found" })

    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, message: "Error getting User", error: error })

    }
}