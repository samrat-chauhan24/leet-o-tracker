import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/src/lib/dbconnect";
import UserModel from "@/src/models/user.model";
import { signupSchema } from "@/src/schemas/authSchema";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const result = signupSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.error.issues[0].message,
          errors: result.error.issues,
        },
        { status: 400 }
      );
    }

    const emailNormalized = result.data.email.trim().toLowerCase();
    const leetcodeNormalized = result.data.leetcodeUsername
      ?.trim()
      .toLowerCase();

    const { password, name } = result.data;

   
    const existingUser = await UserModel.findOne({
      $or: [
        { email: emailNormalized },
        ...(leetcodeNormalized
          ? [{ leetcodeUsername: leetcodeNormalized }]
          : []),
      ],
    });

    if (existingUser) {
      let errorMessage = "User already exists";

      if (existingUser.email === emailNormalized) {
        errorMessage = "Email already registered. Please login.";
      } else if (
        leetcodeNormalized &&
        existingUser.leetcodeUsername?.toLowerCase() ===
          leetcodeNormalized
      ) {
        errorMessage =
          "LeetCode username already in use. Please choose another.";
      }

      return NextResponse.json(
        { success: false, message: errorMessage },
        { status: 400 }
      );
    }

  
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const user = await UserModel.create({
      email: emailNormalized,
      password: hashedPassword,
      name: name || emailNormalized.split("@")[0],
      leetcodeUsername: leetcodeNormalized,
      notifyMail: emailNormalized, // 🔥 FIX your previous error also
    });

    return NextResponse.json({
      success: true,
      message: "Account created successfully! Please login.",
    });

  } catch (error: any) {
    console.error("Signup Error:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "Email or LeetCode username already exists",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Server error. Please try again later.",
      },
      { status: 500 }
    );
  }
}