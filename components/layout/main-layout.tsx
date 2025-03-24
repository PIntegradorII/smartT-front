"use client"

import type React from "react"
import { useEffect } from "react";
import { useState } from "react"
import { usePathname } from "next/navigation"
import { signOutBackend } from "@/services/login/authService"; 
import Link from "next/link"
import { BarChart3, Home, Menu, User, Dumbbell, Calendar, Settings, LogOut, X, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/login/providers";

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname()
  const isMobile = useMobile()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter();
  const { signOutUser } = useAuth();
  const [userData, setUserData] = useState<{ name?: string } | null>(null)

  const getInitials = (name: string) => {
    const words = name.split(" ");
    if (words.length < 2) return name.charAt(0).toUpperCase(); 
  
    return (words[0][0] + words[1][0]).toUpperCase();
  };
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      const userData = storedUser ? JSON.parse(storedUser) : null;
      if (userData?.name) {
        const initials = getInitials(userData.name);
      }
    }
  }, []);

  useEffect(() => {
      if (typeof window !== "undefined") {
        // Verificar que estamos en el navegador
        const storedUser = localStorage.getItem("user")
        setUserData(storedUser ? JSON.parse(storedUser) : null)
      }
    }, [])

  const navigation = [
    { name: "Inicio", href: "/dashboard", icon: Home },
    { name: "Rutina", href: "/rutina", icon: Dumbbell },
    // { name: "Progreso", href: "/progreso", icon: BarChart3 },
    // { name: "Calendario", href: "/calendario", icon: Calendar },
    { name: "Generar Rutina", href: "/generar-rutina", icon: Sparkles },
    { name: "Perfil", href: "/perfil", icon: User },
    // { name: "Administración", href: "/admin", icon: Settings },
    // { name: "Configuración", href: "/configuracion", icon: Settings },
  ]

  const handleLogout = async () => {
    try {
      await signOutBackend(); // Cierra sesión en el backend
      await signOutUser(); // Cierra sesión en Firebase y limpia cookies/localStorage
      router.replace("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Navbar */}
      <header className="sticky top-0 z-40 w-full border-b bg-white dark:bg-black dark:border-gray-800">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Abrir menú</span>
            </Button>
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <Dumbbell className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-xl hidden sm:inline-block">SmartTrainer</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Usuario" />
              <AvatarFallback>{getInitials(userData?.name || "User")}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar para móvil */}
        {isMobile && (
          <div
            className={cn(
              "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm transition-all duration-200",
              sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none",
            )}
          >
            <div
              className={cn(
                "fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-900 p-6 shadow-lg transition-transform duration-200",
                sidebarOpen ? "translate-x-0" : "-translate-x-full",
              )}
            >
              <div className="flex items-center justify-between mb-8">
                <Link href="/dashboard" className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                    <Dumbbell className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-bold text-xl">SmartTrainer</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                  <X className="h-5 w-5" />
                  <span className="sr-only">Cerrar menú</span>
                </Button>
              </div>
              <nav className="space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800",
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                ))}
              </nav>
              <div className="absolute bottom-6 left-6 right-6">
                <Button variant="outline" className="w-full justify-start gap-2" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  Cerrar sesión
                </Button>

              </div>
            </div>
          </div>
        )}

        {/* Sidebar para escritorio */}
        <aside className="hidden md:flex flex-col w-64 border-r bg-white dark:bg-black dark:border-gray-800 p-6">
          <nav className="space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800",
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="mt-auto">
            <Button variant="outline" className="w-full justify-start gap-2" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </Button>
          </div>
        </aside>
        {/* Contenido principal */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
