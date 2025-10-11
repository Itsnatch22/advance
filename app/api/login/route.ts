import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { email, password } = await req.json()
  const allowedUsers = process.env.ALLOWED_USERS?.split(",") || []
  const accessPass = process.env.ACCESS_PASS

  if (allowedUsers.includes(email) && password === accessPass) {
    const res = NextResponse.json({ success: true })
    res.cookies.set("userEmail", email, { httpOnly: true })
    return res
  }

  return NextResponse.json({ success: false }, { status: 401 })
}
