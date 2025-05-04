"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Home,
  Menu,
  User,
  Dumbbell,
  Settings,
  LogOut,
  X,
  Sparkles,
  Utensils,
  Ruler,
  Brain,
  ChevronDown,
  ImagePlus,
  LineChart,
  Camera,
  Info,
  HeartPulse,
  ScanLine,
  QrCode,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface MainLayoutProps {
  children: React.ReactNode
}

interface NavigationItem {
  name: string
  href?: string
  icon: React.ElementType
  subItems?: {
    name: string
    href: string
    icon: React.ElementType
  }[]
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [userData, setUserData] = useState<{ name?: string } | null>(null)
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Custom mobile detection hook
  const [isMobile, setIsMobile] = useState(false)

  // Handle mobile detection
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkIsMobile()

    // Add event listener for window resize
    window.addEventListener("resize", checkIsMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  const getInitials = (name: string) => {
    const words = name.split(" ")
    if (words.length < 2) return name.charAt(0).toUpperCase()
    return (words[0][0] + words[1][0]).toUpperCase()
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user")
      setUserData(storedUser ? JSON.parse(storedUser) : null)
    }
  }, [])

  // Verificar si la ruta actual es un subitem para expandir automáticamente
  useEffect(() => {
    if (pathname.startsWith("/analisisVisualIA/")) {
      setExpandedItems((prev) => (prev.includes("Análisis Visual con IA") ? prev : [...prev, "Análisis Visual con IA"]))
    }
  }, [pathname])

  const navigation: NavigationItem[] = [
    { name: "Inicio", href: "/dashboard", icon: Home },
    { name: "Perfil", href: "/perfil", icon: User },
    { name: "Medidas", href: "/medidas", icon: Ruler },
    { name: "Rutina", href: "/rutina", icon: Dumbbell },
    { name: "Generar Rutina", href: "/generar-rutina", icon: Sparkles },
    { name: "Receta", href: "/receta", icon: Utensils },
    { name: "Nutrición", href: "/nutricion", icon: Settings },
    {
      name: "Análisis Visual",
      icon: Brain,
      subItems: [

        { name: "Reconocimiento de máquinas", href: "/analisisVisualIA/reconocimientoMaq", icon: Camera },
        { name: "Análisis de platos", href: "/analisisVisualIA/analisisPla", icon: Utensils },
        { name: "Información de alimentos", href: "/analisisVisualIA/informacionAli", icon: Info },
        { name: "Escaneo nutricional", href: "/analisisVisualIA/escaneoNutri", icon: QrCode},
      ],
    },
  ]

  // Simplified logout function
  const handleLogout = () => {
    try {
      // Clear local storage
      localStorage.removeItem("user")
      // Redirect to login page
      router.replace("/login")
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

  const toggleSubmenu = (name: string) => {
    setExpandedItems((prev) => (prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]))
  }

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
                  <div key={item.name}>
                    {item.subItems ? (
                      <>
                        <button
                          className={cn(
                            "flex items-center justify-between w-full gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                            expandedItems.includes(item.name)
                              ? "bg-gray-100 dark:bg-gray-800 text-primary"
                              : "hover:bg-gray-100 dark:hover:bg-gray-800",
                          )}
                          onClick={() => toggleSubmenu(item.name)}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className="h-5 w-5" />
                            {item.name}
                          </div>
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 transition-transform",
                              expandedItems.includes(item.name) ? "rotate-180" : "",
                            )}
                          />
                        </button>
                        {expandedItems.includes(item.name) && (
                          <div className="ml-6 mt-1 space-y-1">
                            {item.subItems.map((subItem) => (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                className={cn(
                                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                                  pathname === subItem.href
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-gray-100 dark:hover:bg-gray-800",
                                )}
                                onClick={() => setSidebarOpen(false)}
                              >
                                <subItem.icon className="h-4 w-4" />
                                {subItem.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        href={item.href || "#"}
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
                    )}
                  </div>
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
              <div key={item.name}>
                {item.subItems ? (
                  <>
                    <button
                      className={cn(
                        "flex items-center justify-between w-full gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                        expandedItems.includes(item.name)
                          ? "bg-gray-100 dark:bg-gray-800 text-primary"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800",
                      )}
                      onClick={() => toggleSubmenu(item.name)}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5" />
                        {item.name}
                      </div>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          expandedItems.includes(item.name) ? "rotate-180" : "",
                        )}
                      />
                    </button>
                    {expandedItems.includes(item.name) && (
                      <div className="ml-6 mt-1 space-y-1">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className={cn(
                              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                              pathname === subItem.href
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-gray-100 dark:hover:bg-gray-800",
                            )}
                          >
                            <subItem.icon className="h-4 w-4" />
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href || "#"}
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
                )}
              </div>
            ))}
          </nav>
          <div className="mt-auto pt-6">
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
