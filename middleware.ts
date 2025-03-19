import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const hasToken = req.cookies.has("access_token"); // Verifica si la cookie existe
  const { pathname } = req.nextUrl;

  // Si el usuario está en "/" y tiene token, redirigir al dashboard
  if (pathname === "/") {
    return NextResponse.redirect(new URL(hasToken ? "/dashboard" : "/login", req.url));
  }

  // Si intenta acceder a rutas protegidas sin token, redirigir a login
  const protectedRoutes = ["/dashboard", "/profile", "/settings"];
  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !hasToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/profile/:path*", "/settings/:path*"],
};
