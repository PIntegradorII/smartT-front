"use client";

import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { QuickAccess } from "@/components/quick-access";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Calendar, CheckCircle, Dumbbell, Flame, Heart, TrendingUp, Trophy, Zap } from "lucide-react";
import { getDailyExerciseLog, logExercise, updateLogByUserAndDate } from "@/services/logs_exercises/logs";
import { getID } from "../../services/login/authService";
import { getDailyPlan } from "@/services/training/trainingService";
import WeeklyCalendarAlt from "@/app/resumen/resumen"

export default function DashboardPage() {
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [log, setLog] = useState<boolean | null>(null);
  interface Exercise {
    ejercicio: string;
    series: number;
    repeticiones: number;
  }

  interface Routine {
    day: string;
    routine: {
      titulo: string;
      ejercicios: Exercise[];
    };
  }

  const [routine, setRoutine] = useState<Routine | null>(null);
  const [userData, setUserData] = useState<{ name?: string } | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Verificar que estamos en el navegador
      const storedUser = localStorage.getItem("user")
      setUserData(storedUser ? JSON.parse(storedUser) : null)
    }
  }, [])

  const formatName = (name: string) => {
    return name
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const userName = userData?.name ? formatName(userData.name) : "Usuario"

  useEffect(() => {
    const initializeLog = async () => {
      try {
        const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/Bogota" });
        // Obtén el ID del usuario
        const userData = localStorage.getItem("user")
          ? JSON.parse(localStorage.getItem("user") as string)
          : null;
        const fetchedId = await getID(userData.id);
        setUserId(fetchedId);

        // Crea el log para el día si no existe
        const data = {
          user_id: fetchedId,
          date: new Date().toISOString().split("T")[0], // Fecha en formato YYYY-MM-DD
          completed: false,
        };
        const fetchedRoutine = await getDailyPlan(fetchedId);
        setRoutine(fetchedRoutine);

        const user_log = await getDailyExerciseLog(fetchedId, today);

        console.log("TODAY", today)
        setLog(user_log.completed);
      } catch (error) {
        console.error("Error initializing log:", error);
      }
    };

    initializeLog();
  }, []);
  const handleCompleteRoutine = async () => {
    setIsLoading(true);
    try {
      // Obtén la fecha de hoy en formato YYYY-MM-DD
      const today = new Date().toLocaleDateString("en-CA");

      // Actualiza el log a completed: 1
      const updatedLog = await updateLogByUserAndDate(userId, today, 1);
      //setRefreshCalendar();
      // Actualiza el estado local para reflejar los cambios inmediatamente
      setLog(true);
      setIsCompleted(true);
    } catch (error) {
      console.error("Error al completar la rutina:", error);

      // Manejar caso de log no encontrado
      if ((error as any)?.response?.status === 404) {
        console.error("No se encontró un log para hoy.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  //datos
  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            ¡Bienvenido, {userName}!
          </h1>

          <p className="text-muted-foreground">
            Aquí tienes un resumen de tu progreso y tu rutina de hoy.
          </p>
        </div>
        <WeeklyCalendarAlt refresh={isCompleted} />

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
              <div className="h-12 w-12 rounded-full gradient-purple flex items-center justify-center mb-3">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold">4 de 5</div>
              <p className="text-sm text-muted-foreground">
                Entrenamientos completados
              </p>
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
              <div className="h-12 w-12 rounded-full gradient-purple flex items-center justify-center mb-3">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold">3</div>
              <p className="text-sm text-muted-foreground">
                Logros desbloqueados
              </p>
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
            {!isCompleted && !log && (
              <Button onClick={handleCompleteRoutine} disabled={isLoading}>
                <Dumbbell className="mr-2 h-4 w-4" />
                {isLoading ? "Cargando..." : "Rutina terminada"}
              </Button>
            )}
          </CardHeader>
          {log ? (
            <div className="flex flex-col items-center gap-4 mt-4 mb-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
              <h2 className="text-xl font-bold text-center">
                Rutina de hoy terminada
              </h2>
            </div>
          ) : (
            <>
              <div>
                <CardContent>
                  {routine && routine.routine && Array.isArray(routine.routine.ejercicios) ? (
                    routine.routine.ejercicios.map((exercise, index) => (
                      <Card key={index} className="mb-4">
                        <CardContent className="flex items-center gap-4">
                          <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center">
                            <Dumbbell className="h-8 w-8 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{exercise.ejercicio}</h4>
                            <p className="text-sm text-muted-foreground">
                              {exercise.series} series • {exercise.repeticiones}
                            </p>
                            <Progress value={0} className="h-2" />
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p>No hay rutinas por mostrar</p>
                  )}

                </CardContent>
              </div>
            </>
          )}
        </Card>

        {/* Próximos entrenamientos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{routine?.day || "Día no disponible"}</CardTitle>
              <CardDescription>{routine?.routine?.titulo || "Sin rutina"}</CardDescription>
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
                      <span className="text-sm text-muted-foreground">
                        Piernas
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      14 de marzo • 60 min
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Miércoles</h4>
                      <span className="text-sm text-muted-foreground">
                        Descanso
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      15 de marzo
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Jueves</h4>
                      <span className="text-sm text-muted-foreground">
                        Hombros y brazos
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      16 de marzo • 45 min
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estadísticas de salud</CardTitle>
              <CardDescription>
                Métricas importantes para tu bienestar
              </CardDescription>
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
  );
}