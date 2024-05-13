import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongoDb"
// import User from "@/lib/mongo_models/users.model"
import Dwolla from "@/lib/mongo_models/dwolla.models"


export async function POST(req: Request) {
    try {
        await dbConnect()

        const data = await req.json()

        const { firstName,lastName,address1,city,state,postalCode,dateOfBirth,ssn,email,
            userId,dwollaCustomerId,dwollaCustomerUrl } = data


        const dwolla = new Dwolla({firstName,lastName,address1,city,state,postalCode,dateOfBirth,ssn,email,
            userId,dwollaCustomerId,dwollaCustomerUrl})

        await dwolla.save()

        return NextResponse.json({ success: true, message: "Dwolla User Created Successfully", user: dwolla })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, message: "Error Creating Dwolla User", error: error })

    }
}