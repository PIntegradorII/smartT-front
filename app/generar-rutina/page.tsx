"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dumbbell, Loader2, Sparkles, Zap } from "lucide-react"
import Link from "next/link"
import { getID } from "@/services/login/authService";
import { createPlan } from "@/services/training/trainingService";
import { useRouter } from "next/navigation";


export default function GenerarRutinaPage() {
  const [generating, setGenerating] = useState(false)
  const [routineGenerated, setRoutineGenerated] = useState(false)
  const router = useRouter();
  
  const handleGenerateRoutine = async () => {
    setGenerating(true);
  
    try {
      const userData = localStorage.getItem("user") 
        ? JSON.parse(localStorage.getItem("user") as string) 
        : null;
  
      if (userData && userData.id) {
        const userId = await getID(userData.id);  
        // Crear plan de entrenamiento personalizado
        const userPlan = await createPlan(userId);
  
        // Aquí puedes usar `userInfo` para generar la rutina basada en sus datos
      } else {
        console.error("No se encontró google_id en userData.");}
    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error);
    } finally {
      setTimeout(() => {
        setGenerating(false);
        setRoutineGenerated(true);
        router.push("/rutina");
      }, 3000);
    }
  };  

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Generar rutina con IA</h1>
          <p className="text-muted-foreground">Crea una rutina personalizada basada en tus objetivos y preferencias.</p>
        </div>

        <Tabs defaultValue="generar" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="generar">Generar rutina</TabsTrigger>
            <TabsTrigger value="historial">Historial de rutinas</TabsTrigger>
          </TabsList>

          <TabsContent value="generar">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Configuración de rutina</CardTitle>
                    <CardDescription>Personaliza los parámetros para tu rutina de entrenamiento</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button className="w-full gap-2" onClick={handleGenerateRoutine} disabled={generating}>
                      {generating ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Generando rutina...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          Generar rutina personalizada
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>

                {routineGenerated && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Tu rutina personalizada</CardTitle>
                      <CardDescription>Generada con IA según tus preferencias</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-muted p-4 rounded-lg">
                        <h3 className="font-medium mb-2">Resumen de la rutina</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Esta rutina de 4 días está diseñada para maximizar la hipertrofia muscular con un enfoque en
                          el entrenamiento de fuerza. Cada sesión dura aproximadamente 60 minutos y requiere acceso a un
                          gimnasio completo.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="gap-1">
                            <Dumbbell className="h-3 w-3" />4 días/semana
                          </Badge>
                          <Badge variant="outline" className="gap-1">
                            <Zap className="h-3 w-3" />
                            60 min/sesión
                          </Badge>
                          <Badge variant="secondary">Hipertrofia</Badge>
                          <Badge variant="secondary">Nivel intermedio</Badge>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium mb-2">Día 1: Pecho y Tríceps</h3>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-primary"></span>
                              Press de banca: 4 series x 8-10 repeticiones
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-primary"></span>
                              Press inclinado con mancuernas: 3 series x 10-12 repeticiones
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-primary"></span>
                              Aperturas en polea: 3 series x 12-15 repeticiones
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-primary"></span>
                              Fondos en paralelas: 3 series x 8-12 repeticiones
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-primary"></span>
                              Extensiones de tríceps en polea: 4 series x 10-12 repeticiones
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="font-medium mb-2">Día 2: Espalda y Bíceps</h3>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-primary"></span>
                              Dominadas: 4 series x 6-10 repeticiones
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-primary"></span>
                              Remo con barra: 4 series x 8-10 repeticiones
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-primary"></span>
                              Remo en polea baja: 3 series x 10-12 repeticiones
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-primary"></span>
                              Curl de bíceps con barra: 3 series x 10-12 repeticiones
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-primary"></span>
                              Curl de martillo: 3 series x 12-15 repeticiones
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="font-medium mb-2">Día 3: Piernas</h3>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-primary"></span>
                              Sentadillas con barra: 4 series x 8-10 repeticiones
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-primary"></span>
                              Prensa de piernas: 3 series x 10-12 repeticiones
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-primary"></span>
                              Extensiones de cuádriceps: 3 series x 12-15 repeticiones
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-primary"></span>
                              Curl femoral: 3 series x 10-12 repeticiones
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-primary"></span>
                              Elevaciones de pantorrilla: 4 series x 15-20 repeticiones
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="font-medium mb-2">Día 4: Hombros y Abdominales</h3>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-primary"></span>
                              Press militar: 4 series x 8-10 repeticiones
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-primary"></span>
                              Elevaciones laterales: 3 series x 12-15 repeticiones
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-primary"></span>
                              Elevaciones frontales: 3 series x 12-15 repeticiones
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-primary"></span>
                              Crunch abdominal: 3 series x 15-20 repeticiones
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-primary"></span>
                              Plancha: 3 series x 30-60 segundos
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col sm:flex-row gap-2">
                      <Button variant="outline" className="w-full sm:w-auto">
                        Descargar PDF
                      </Button>
                      <Link href="/rutina" className="w-full sm:w-auto">
                        <Button className="w-full">Guardar y comenzar</Button>
                      </Link>
                    </CardFooter>
                  </Card>
                )}
              </div>

              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Consejos para tu rutina</CardTitle>
                    <CardDescription>Recomendaciones para maximizar resultados</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-medium">Progresión de carga</h3>
                      <p className="text-sm text-muted-foreground">
                        Aumenta gradualmente el peso o las repeticiones para seguir desafiando tus músculos y promover
                        el crecimiento.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-medium">Técnica adecuada</h3>
                      <p className="text-sm text-muted-foreground">
                        Prioriza siempre la técnica correcta sobre el peso. Esto maximizará los resultados y prevendrá
                        lesiones.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-medium">Descanso entre series</h3>
                      <p className="text-sm text-muted-foreground">
                        Para hipertrofia, descansa 60-90 segundos entre series. Para fuerza, 2-3 minutos.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-medium">Nutrición</h3>
                      <p className="text-sm text-muted-foreground">
                        Asegúrate de consumir suficiente proteína (1.6-2.2g/kg de peso) y calorías adecuadas para tus
                        objetivos.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-medium">Recuperación</h3>
                      <p className="text-sm text-muted-foreground">
                        Duerme 7-9 horas por noche y permite al menos 48 horas de recuperación para cada grupo muscular.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="historial">
            <Card>
              <CardHeader>
                <CardTitle>Historial de rutinas generadas</CardTitle>
                <CardDescription>Rutinas que has creado anteriormente</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">Rutina de hipertrofia</h3>
                        <p className="text-sm text-muted-foreground">Generada el 10 de marzo de 2024</p>
                      </div>
                      <Badge>Activa</Badge>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline" className="gap-1">
                        <Dumbbell className="h-3 w-3" />4 días/semana
                      </Badge>
                      <Badge variant="outline" className="gap-1">
                        <Zap className="h-3 w-3" />
                        60 min/sesión
                      </Badge>
                      <Badge variant="secondary">Hipertrofia</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Ver detalles
                      </Button>
                      <Button size="sm">Activar</Button>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">Rutina de pérdida de peso</h3>
                        <p className="text-sm text-muted-foreground">Generada el 25 de febrero de 2024</p>
                      </div>
                      <Badge variant="outline">Inactiva</Badge>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline" className="gap-1">
                        <Dumbbell className="h-3 w-3" />5 días/semana
                      </Badge>
                      <Badge variant="outline" className="gap-1">
                        <Zap className="h-3 w-3" />
                        45 min/sesión
                      </Badge>
                      <Badge variant="secondary">Pérdida de peso</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Ver detalles
                      </Button>
                      <Button size="sm">Activar</Button>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">Rutina de fuerza</h3>
                        <p className="text-sm text-muted-foreground">Generada el 10 de febrero de 2024</p>
                      </div>
                      <Badge variant="outline">Inactiva</Badge>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline" className="gap-1">
                        <Dumbbell className="h-3 w-3" />3 días/semana
                      </Badge>
                      <Badge variant="outline" className="gap-1">
                        <Zap className="h-3 w-3" />
                        75 min/sesión
                      </Badge>
                      <Badge variant="secondary">Fuerza</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Ver detalles
                      </Button>
                      <Button size="sm">Activar</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}

