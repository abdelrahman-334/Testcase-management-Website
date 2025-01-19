import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("jwt")?.value; // Check for the JWT token in cookies

  if (!token) {
    // If no token, redirect to the login page
    return NextResponse.redirect(new URL("/auth/sign-in", req.url));
  }

  return NextResponse.next(); // Allow access if token exists
}

// Apply middleware to specific routes
export const config = {
  matcher: ["/test-cases"], // Add protected routes here
};
 