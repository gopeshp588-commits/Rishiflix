import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "users.json");

interface User {
  email: string;
  password: string;
  nickname: string | null;
  createdAt: string;
}

function readUsers(): User[] {
  try {
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(raw) as User[];
  } catch {
    return [];
  }
}

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 }
    );
  }

  const users = readUsers();

  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );

  if (!user) {
    // Distinct error code so frontend knows to show "sign up" prompt
    return NextResponse.json(
      { error: "No account found with this email.", code: "USER_NOT_FOUND" },
      { status: 404 }
    );
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    // Distinct error code so frontend knows to play faah sound
    return NextResponse.json(
      { error: "Incorrect password. Please try again.", code: "WRONG_PASSWORD" },
      { status: 401 }
    );
  }

  return NextResponse.json(
    { message: "Signed in successfully.", nickname: user.nickname },
    { status: 200 }
  );
}
