import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { readUsers, writeUsers } from "@/app/api/auth/signup/route";

/**
 * GET /api/auth/forgot-password?email=xxx
 * Returns the security question for the given email (not the answer).
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email")?.toLowerCase().trim();

  if (!email) {
    return NextResponse.json(
      { error: "Email is required." },
      { status: 400 }
    );
  }

  const users = readUsers();
  const user = users.find((u) => u.email === email);

  if (!user) {
    return NextResponse.json(
      { error: "No account found with this email.", code: "USER_NOT_FOUND" },
      { status: 404 }
    );
  }

  return NextResponse.json(
    { securityQuestion: user.securityQuestion },
    { status: 200 }
  );
}

/**
 * POST /api/auth/forgot-password
 * Body: { email, securityAnswer, newPassword }
 * Verifies the answer; if correct, updates the password.
 */
export async function POST(req: NextRequest) {
  const { email, securityAnswer, newPassword } = await req.json();

  if (!email || !securityAnswer || !newPassword) {
    return NextResponse.json(
      { error: "All fields are required." },
      { status: 400 }
    );
  }

  if (newPassword.length < 4 || newPassword.length > 60) {
    return NextResponse.json(
      { error: "Password must be between 4 and 60 characters." },
      { status: 400 }
    );
  }

  const users = readUsers();
  const index = users.findIndex(
    (u) => u.email === email.toLowerCase().trim()
  );

  if (index === -1) {
    return NextResponse.json(
      { error: "No account found with this email." },
      { status: 404 }
    );
  }

  const answerMatch = await bcrypt.compare(
    securityAnswer.trim().toLowerCase(),
    users[index].securityAnswer
  );

  if (!answerMatch) {
    return NextResponse.json(
      { error: "Incorrect answer. Please try again.", code: "WRONG_ANSWER" },
      { status: 401 }
    );
  }

  // Answer is correct — update password
  users[index].password = await bcrypt.hash(newPassword, 10);
  writeUsers(users);

  return NextResponse.json(
    { message: "Password updated successfully." },
    { status: 200 }
  );
}
