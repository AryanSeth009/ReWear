import { NextRequest, NextResponse } from "next/server";
import { signIn } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { user, token } = await signIn(email, password);

    // Set token as cookie
    return NextResponse.json({ user, token }, {
      status: 200,
      headers: {
        "Set-Cookie": `auth-token=${token}; Path=/; HttpOnly; SameSite=Lax`
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Invalid credentials" }, { status: 401 });
  }
} 