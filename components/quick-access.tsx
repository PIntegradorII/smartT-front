import Link from "next/link"
import { BarChart3, Dumbbell, Settings, User, Sparkles, Utensils } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function QuickAccess() {
  const quickLinks = [
    { name: "Dashboard", href: "/dashboard", icon: BarChart3, color: "bg-primary" },
    { name: "Rutina", href: "/rutina", icon: Dumbbell, color: "bg-secondary" },
    { name: "Generar Rutina", href: "/generar-rutina", icon: Sparkles, color: "bg-accent" },
<<<<<<< HEAD
   { name: "Nutrición", href: "/nutricion", icon: BarChart3, color: "bg-success" },
=======
    { name: "Receta", href: "/receta", icon: Utensils, color: "bg-warning" },
    // { name: "Progreso", href: "/progreso", icon: BarChart3, color: "bg-success" },
>>>>>>> c5ba0d3 (HU-Voz-Texto realizada Recetas)
    // { name: "Perfil", href: "/perfil", icon: User, color: "bg-primary" },
    // { name: "Admin", href: "/admin", icon: Settings, color: "bg-secondary" },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
      {quickLinks.map((link) => (
        <Link key={link.name} href={link.href}>
          <Card className="h-full hover:border-primary/50 transition-colors">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <div className={`h-10 w-10 rounded-full ${link.color} flex items-center justify-center mb-2`}>
                <link.icon className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-medium">{link.name}</span>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

