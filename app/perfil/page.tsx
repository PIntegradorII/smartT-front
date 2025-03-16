"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Bell, Camera, Edit, Lock, User } from "lucide-react"

export default function PerfilPage() {
  const [editing, setEditing] = useState(false)

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Tu perfil</h1>
          <p className="text-muted-foreground">Gestiona tu información personal y preferencias.</p>
        </div>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="personal">Información personal</TabsTrigger>
            <TabsTrigger value="cuenta">Cuenta</TabsTrigger>
            <TabsTrigger value="notificaciones">Notificaciones</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-1">
                <CardContent className="p-6 flex flex-col items-center">
                  <div className="relative mb-4">
                    <Avatar className="h-32 w-32">
                      <AvatarImage src="/placeholder.svg?height=128&width=128" alt="Usuario" />
                      <AvatarFallback className="text-3xl">JP</AvatarFallback>
                    </Avatar>
                    <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 rounded-full">
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <h3 className="text-xl font-bold">Juan Pérez</h3>
                  <p className="text-sm text-muted-foreground mb-4">juan.perez@ejemplo.com</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Badge variant="secondary">Nivel Intermedio</Badge>
                    <Badge variant="outline">4 semanas</Badge>
                    <Badge variant="outline">Hipertrofia</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Información personal</CardTitle>
                    <CardDescription>Actualiza tus datos personales</CardDescription>
                  </div>
                  <Button variant="outline" size="icon" onClick={() => setEditing(!editing)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre</Label>
                      <Input id="nombre" defaultValue="Juan" disabled={!editing} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apellido">Apellido</Label>
                      <Input id="apellido" defaultValue="Pérez" disabled={!editing} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input id="email" type="email" defaultValue="juan.perez@ejemplo.com" disabled={!editing} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono</Label>
                      <Input id="telefono" defaultValue="+34 612 345 678" disabled={!editing} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fecha-nacimiento">Fecha de nacimiento</Label>
                      <Input id="fecha-nacimiento" defaultValue="15/05/1990" disabled={!editing} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="genero">Género</Label>
                    <Select defaultValue="masculino" disabled={!editing}>
                      <SelectTrigger id="genero">
                        <SelectValue placeholder="Selecciona tu género" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="masculino">Masculino</SelectItem>
                        <SelectItem value="femenino">Femenino</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                        <SelectItem value="no-especificar">Prefiero no especificar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter className={editing ? "flex justify-end gap-2" : "hidden"}>
                  <Button variant="outline" onClick={() => setEditing(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={() => setEditing(false)}>Guardar cambios</Button>
                </CardFooter>
              </Card>

              <Card className="md:col-span-3">
                <CardHeader>
                  <CardTitle>Datos físicos y objetivos</CardTitle>
                  <CardDescription>Actualiza tus medidas y objetivos de entrenamiento</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="altura">Altura (cm)</Label>
                      <Input id="altura" type="number" defaultValue="178" disabled={!editing} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="peso">Peso actual (kg)</Label>
                      <Input id="peso" type="number" defaultValue="78.5" disabled={!editing} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="objetivo-peso">Peso objetivo (kg)</Label>
                      <Input id="objetivo-peso" type="number" defaultValue="75" disabled={!editing} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="objetivo-principal">Objetivo principal</Label>
                      <Select defaultValue="hipertrofia" disabled={!editing}>
                        <SelectTrigger id="objetivo-principal">
                          <SelectValue placeholder="Selecciona tu objetivo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="perder-peso">Perder peso</SelectItem>
                          <SelectItem value="hipertrofia">Ganar masa muscular</SelectItem>
                          <SelectItem value="tonificar">Tonificar el cuerpo</SelectItem>
                          <SelectItem value="resistencia">Mejorar resistencia</SelectItem>
                          <SelectItem value="fuerza">Aumentar fuerza</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nivel-actividad">Nivel de actividad física</Label>
                      <Select defaultValue="moderado" disabled={!editing}>
                        <SelectTrigger id="nivel-actividad">
                          <SelectValue placeholder="Selecciona tu nivel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sedentario">Sedentario (poco o nada de ejercicio)</SelectItem>
                          <SelectItem value="ligero">Ligero (ejercicio 1-3 días/semana)</SelectItem>
                          <SelectItem value="moderado">Moderado (ejercicio 3-5 días/semana)</SelectItem>
                          <SelectItem value="activo">Activo (ejercicio 6-7 días/semana)</SelectItem>
                          <SelectItem value="muy-activo">Muy activo (ejercicio intenso diario)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className={editing ? "flex justify-end gap-2" : "hidden"}>
                  <Button variant="outline" onClick={() => setEditing(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={() => setEditing(false)}>Guardar cambios</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="cuenta">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Seguridad de la cuenta</CardTitle>
                  <CardDescription>Gestiona tu contraseña y seguridad</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Contraseña actual</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">Nueva contraseña</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmar nueva contraseña</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button>Actualizar contraseña</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center">
                  <div className="mr-4">
                    <Lock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Autenticación de dos factores</CardTitle>
                    <CardDescription>Añade una capa extra de seguridad a tu cuenta</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    La autenticación de dos factores añade una capa adicional de seguridad a tu cuenta al requerir más
                    que solo una contraseña para iniciar sesión.
                  </p>
                  <Button variant="outline">Configurar autenticación de dos factores</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center">
                  <div className="mr-4">
                    <User className="h-6 w-6 text-destructive" />
                  </div>
                  <div>
                    <CardTitle>Eliminar cuenta</CardTitle>
                    <CardDescription>Elimina permanentemente tu cuenta y todos tus datos</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, asegúrate de que realmente quieres
                    hacer esto.
                  </p>
                  <Button variant="destructive">Eliminar cuenta</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notificaciones">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Bell className="h-6 w-6 text-primary" />
                  <div>
                    <CardTitle>Preferencias de notificaciones</CardTitle>
                    <CardDescription>Configura cómo y cuándo quieres recibir notificaciones</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notificaciones por correo electrónico</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-recordatorios" className="font-medium">
                          Recordatorios de entrenamiento
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Recibe recordatorios de tus entrenamientos programados
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        id="email-recordatorios"
                        defaultChecked
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-progreso" className="font-medium">
                          Informes de progreso
                        </Label>
                        <p className="text-sm text-muted-foreground">Recibe informes semanales de tu progreso</p>
                      </div>
                      <input
                        type="checkbox"
                        id="email-progreso"
                        defaultChecked
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-consejos" className="font-medium">
                          Consejos y recomendaciones
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Recibe consejos personalizados para mejorar tu entrenamiento
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        id="email-consejos"
                        defaultChecked
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notificaciones push</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="push-recordatorios" className="font-medium">
                          Recordatorios de entrenamiento
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Recibe notificaciones antes de tus entrenamientos
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        id="push-recordatorios"
                        defaultChecked
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="push-logros" className="font-medium">
                          Logros y metas
                        </Label>
                        <p className="text-sm text-muted-foreground">Recibe notificaciones cuando alcances tus metas</p>
                      </div>
                      <input
                        type="checkbox"
                        id="push-logros"
                        defaultChecked
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="push-actualizaciones" className="font-medium">
                          Actualizaciones de la aplicación
                        </Label>
                        <p className="text-sm text-muted-foreground">Recibe notificaciones sobre nuevas funciones</p>
                      </div>
                      <input
                        type="checkbox"
                        id="push-actualizaciones"
                        defaultChecked
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>Guardar preferencias</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}

