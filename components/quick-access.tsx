import Link from "next/link"
import { BarChart3, Dumbbell, Settings, User, Sparkles, Utensils, Ruler, Brain, QrCode, Info, Camera } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function QuickAccess() {
  const quickLinks = [
    { name: "Dashboard", href: "/dashboard", icon: BarChart3, color: "bg-primary" },
    { name: "Rutina", href: "/rutina", icon: Dumbbell, color: "bg-secondary" },
    { name: "Generar Rutina", href: "/generar-rutina", icon: Sparkles, color: "bg-accent" },
    { name: "Perfil", href: "/perfil", icon: User, color: "bg-primary" },
    { name: "Receta", href: "/receta", icon: Utensils, color: "bg-warning" },
    { name: "Nutrición", href: "/nutricion", icon: BarChart3, color: "bg-success" },
    { name: "Medidas", href: "/medidas", icon: Ruler },
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
    // { name: "Admin", href: "/admin", icon: Settings, color: "bg-secondary" },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
      {quickLinks.filter(link => link.href).map((link) => (
        <Link key={link.name} href={link.href || "#"}>
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

