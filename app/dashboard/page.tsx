import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, Calendar, Dumbbell, Flame, Heart, TrendingUp, Trophy, Zap } from "lucide-react"
import { QuickAccess } from "@/components/quick-access"

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">¡Bienvenido, Juan!</h1>
          <p className="text-muted-foreground">Aquí tienes un resumen de tu progreso y tu rutina de hoy.</p>
        </div>

        {/* Acceso rápido */}
        <QuickAccess />

        {/* Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
              <div className="h-12 w-12 rounded-full gradient-purple flex items-center justify-center mb-3">
                <Flame className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold">1,248</div>
              <p className="text-sm text-muted-foreground">Calorías quemadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
              <div className="h-12 w-12 rounded-full gradient-orange-green flex items-center justify-center mb-3">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold">4 de 5</div>
              <p className="text-sm text-muted-foreground">Entrenamientos completados</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
              <div className="h-12 w-12 rounded-full gradient-purple flex items-center justify-center mb-3">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold">+8%</div>
              <p className="text-sm text-muted-foreground">Progreso semanal</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
              <div className="h-12 w-12 rounded-full gradient-orange-green flex items-center justify-center mb-3">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold">3</div>
              <p className="text-sm text-muted-foreground">Logros desbloqueados</p>
            </CardContent>
          </Card>
        </div>

        {/* Rutina de hoy */}
        <Card className="col-span-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Tu rutina de hoy</CardTitle>
              <CardDescription>Lunes, 13 de marzo</CardDescription>
            </div>
            <Button>
              <Dumbbell className="mr-2 h-4 w-4" />
              Comenzar entrenamiento
            </Button>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="ejercicios">
              <TabsList className="mb-4">
                <TabsTrigger value="ejercicios">Ejercicios</TabsTrigger>
                <TabsTrigger value="nutricion">Nutrición</TabsTrigger>
              </TabsList>

              <TabsContent value="ejercicios" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Ejercicio 1 */}
                  <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center">
                        <Dumbbell className="h-8 w-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-medium">Press de banca</h4>
                          <span className="text-sm text-muted-foreground">4 series</span>
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">12 repeticiones • 60kg</div>
                        <Progress value={0} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Ejercicio 2 */}
                  <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center">
                        <Dumbbell className="h-8 w-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-medium">Dominadas</h4>
                          <span className="text-sm text-muted-foreground">3 series</span>
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">10 repeticiones • Peso corporal</div>
                        <Progress value={0} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Ejercicio 3 */}
                  <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center">
                        <Dumbbell className="h-8 w-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-medium">Remo con barra</h4>
                          <span className="text-sm text-muted-foreground">4 series</span>
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">12 repeticiones • 50kg</div>
                        <Progress value={0} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Ejercicio 4 */}
                  <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center">
                        <Dumbbell className="h-8 w-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-medium">Curl de bíceps</h4>
                          <span className="text-sm text-muted-foreground">3 series</span>
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">15 repeticiones • 15kg</div>
                        <Progress value={0} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="nutricion">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Desayuno */}
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Desayuno</h4>
                      <ul className="space-y-1 text-sm">
                        <li className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-success"></span>
                          Avena con plátano y miel (300 kcal)
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-success"></span>
                          Yogur griego con nueces (150 kcal)
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-success"></span>
                          Café negro o té verde
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Almuerzo */}
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Almuerzo</h4>
                      <ul className="space-y-1 text-sm">
                        <li className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-success"></span>
                          Pechuga de pollo a la plancha (200 kcal)
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-success"></span>
                          Arroz integral (150 kcal)
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-success"></span>
                          Ensalada de verduras (100 kcal)
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Cena */}
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Cena</h4>
                      <ul className="space-y-1 text-sm">
                        <li className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-success"></span>
                          Salmón al horno (250 kcal)
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-success"></span>
                          Batata asada (100 kcal)
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-success"></span>
                          Brócoli al vapor (50 kcal)
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Snacks */}
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Snacks</h4>
                      <ul className="space-y-1 text-sm">
                        <li className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-success"></span>
                          Batido de proteínas (150 kcal)
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-success"></span>
                          Manzana con mantequilla de almendras (200 kcal)
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-success"></span>
                          Puñado de frutos secos (100 kcal)
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Próximos entrenamientos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Próximos entrenamientos</CardTitle>
              <CardDescription>Tu planificación para esta semana</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Martes</h4>
                      <span className="text-sm text-muted-foreground">Piernas</span>
                    </div>
                    <div className="text-sm text-muted-foreground">14 de marzo • 60 min</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Miércoles</h4>
                      <span className="text-sm text-muted-foreground">Descanso</span>
                    </div>
                    <div className="text-sm text-muted-foreground">15 de marzo</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Jueves</h4>
                      <span className="text-sm text-muted-foreground">Hombros y brazos</span>
                    </div>
                    <div className="text-sm text-muted-foreground">16 de marzo • 45 min</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estadísticas de salud</CardTitle>
              <CardDescription>Métricas importantes para tu bienestar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-destructive" />
                      <span className="font-medium">Ritmo cardíaco</span>
                    </div>
                    <span className="text-sm font-medium">72 bpm</span>
                  </div>
                  <Progress value={72} max={200} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Reposo</span>
                    <span>Máximo</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-accent" />
                      <span className="font-medium">Nivel de energía</span>
                    </div>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-success" />
                      <span className="font-medium">Nivel de actividad</span>
                    </div>
                    <span className="text-sm font-medium">68%</span>
                  </div>
                  <Progress value={68} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}

