import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublicPath =
    path === "/login" ||
    path === "/organization/main-dashboard" ||
    path === "/dashboard" ;

  const token  =  request.cookies.get("__Secure-authjs.session-token")?.value || request.cookies.get("authjs.session-token")?.value;

  if (isPublicPath && token) {
        return NextResponse.redirect(new URL("/", request.url));
  }
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}
export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
