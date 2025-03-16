import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dumbbell, Settings } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full gradient-purple flex items-center justify-center">
              <Dumbbell className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-xl">FitPro</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Iniciar sesión</Button>
            </Link>
            <Link href="/registro">
              <Button>Registrarse</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="flex-1 flex flex-col items-center justify-center p-6 md:p-10 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Tu entrenador personal con <span className="text-primary">IA</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10">
            Rutinas personalizadas, seguimiento de progreso y más para alcanzar tus objetivos fitness.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/registro">
              <Button size="lg" className="w-full sm:w-auto text-lg">
                Comenzar ahora
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg">
                Ya tengo cuenta
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-16 md:py-24">
        <h2 className="text-3xl font-bold text-center mb-12">Características principales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-2 border-primary/20 hover:border-primary/50 transition-colors">
            <CardContent className="p-6">
              <div className="h-12 w-12 rounded-full gradient-purple flex items-center justify-center mb-4">
                <Dumbbell className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Rutinas personalizadas</h3>
              <p className="text-muted-foreground">
                Rutinas generadas con IA adaptadas a tus objetivos y condición física.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20 hover:border-primary/50 transition-colors">
            <CardContent className="p-6">
              <div className="h-12 w-12 rounded-full gradient-orange-green flex items-center justify-center mb-4">
                <Dumbbell className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Seguimiento de progreso</h3>
              <p className="text-muted-foreground">Visualiza tu progreso con gráficos detallados y estadísticas.</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20 hover:border-primary/50 transition-colors">
            <CardContent className="p-6">
              <div className="h-12 w-12 rounded-full gradient-purple flex items-center justify-center mb-4">
                <Dumbbell className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Adaptación continua</h3>
              <p className="text-muted-foreground">Tu rutina evoluciona contigo a medida que progresas.</p>
            </CardContent>
          </Card>

          <div className="col-span-full mt-8 text-center">
            <Link href="/admin">
              <Button size="lg" variant="outline" className="gap-2">
                <Settings className="h-4 w-4" />
                Acceder al Panel de Administración
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full gradient-purple flex items-center justify-center">
              <Dumbbell className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold">FitPro</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2024 FitPro. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

