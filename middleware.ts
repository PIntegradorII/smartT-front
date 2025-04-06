import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const hasToken = req.cookies.has("access_token");
  const ruta = req.cookies.get("ruta")?.value;
  const { pathname } = req.nextUrl;

  // ⚡ Permitir acceso sin restricciones a recursos estáticos y a la carpeta /gifs
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/gifs/") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // ⚡ Permitir acceso a la página de login sin restricciones
  if (pathname === "/login") {
    return NextResponse.next();
  }

  // 🚪 Redirigir a login si no hay token o ruta
  if (!hasToken || !ruta) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 🔄 Si el usuario está en "/" y tiene token, redirigirlo a /dashboard
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // 📌 Definir las rutas restringidas según el tipo de usuario
  const allowedForRuta1 = [
    "/dashboard",
    "/rutina",
    "/progreso",
    "/calendario",
    "/generar-rutina",
    "/perfil",
    "/admin",
    "/nutricion",
    "/configuracion",
    "/receta",
  ];

  // 🚫 Usuarios con ruta = 1 solo pueden acceder a estas rutas
  if (ruta === "1" && !allowedForRuta1.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // 🚫 Usuarios con ruta = 0 pueden acceder a todo EXCEPTO estas rutas
  if (ruta === "0" && allowedForRuta1.includes(pathname)) {
    return NextResponse.redirect(new URL("/datos-fisicos", req.url));
  }

  return NextResponse.next();
}

export const config = {
  // Aplica el middleware a todas las rutas EXCEPTO las que empiezan con /gifs
  matcher: ["/((?!gifs/).*)"],
};
