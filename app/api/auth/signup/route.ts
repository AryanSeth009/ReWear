import { NextRequest, NextResponse } from "next/server";
import { signUp, generateToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName } = await request.json();

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const user = await signUp(email, password, firstName, lastName);
    const token = generateToken(user._id);

    // Set token as cookie (optional)
    return NextResponse.json({ user, token }, {
      status: 201,
      headers: {
        "Set-Cookie": `auth-token=${token}; Path=/; HttpOnly; SameSite=Lax`
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
} 