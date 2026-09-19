import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "users.json");

export interface User {
  email: string;
  password: string;
  nickname: string | null;
  securityQuestion: string;
  securityAnswer: string; // bcrypt hashed
  createdAt: string;
}

export function readUsers(): User[] {
  try {
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(raw) as User[];
  } catch {
    return [];
  }
}

export function writeUsers(users: User[]) {
  fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2), "utf-8");
}

export async function POST(req: NextRequest) {
  const { email, password, nickname, securityQuestion, securityAnswer } =
    await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 }
    );
  }

  if (!securityQuestion || !securityAnswer?.trim()) {
    return NextResponse.json(
      { error: "A security question and answer are required." },
      { status: 400 }
    );
  }

  const users = readUsers();

  const existing = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 409 }
    );
  }

  const [hashedPassword, hashedAnswer] = await Promise.all([
    bcrypt.hash(password, 10),
    bcrypt.hash(securityAnswer.trim().toLowerCase(), 10),
  ]);

  users.push({
    email: email.toLowerCase(),
    password: hashedPassword,
    nickname: nickname?.trim() || null,
    securityQuestion,
    securityAnswer: hashedAnswer,
    createdAt: new Date().toISOString(),
  });

  writeUsers(users);

  return NextResponse.json(
    { message: "Account created successfully." },
    { status: 201 }
  );
}
