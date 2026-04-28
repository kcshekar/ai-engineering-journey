import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function middleware(request: any) {
  const session = await auth()

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|login).*)"],
}
