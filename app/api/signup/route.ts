import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoDb";

import User from "@/lib/mongo_models/users.model";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const data = await req.json();
    const { email, password, firstName, lastName } = data as {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    };
    console.log("api :-- ", email, password, firstName, lastName);

    const userCheck = await User.findOne({ email: email });
    if (userCheck) {
      return NextResponse.json({
        success: false,
        message: "user already exists",
      });
    }

    const user = new User({
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
    });
    await user.save();

    return NextResponse.json({
      success: true,
      message: "User Created Successfully",

      user: user,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Error Creating User",
      error: error,
    });
  }
}
