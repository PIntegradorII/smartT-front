"use client";
import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit } from "lucide-react";

export default function PerfilPage() {
  interface UserData {
    avatar?: string;
    name?: string;
    email?: string;
  }

  const [userData, setUserData] = useState<UserData | null>(null);
  const [editing, setEditing] = useState(false);
  const [editingDatosFisicos, setEditingDatosFisicos] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        setUserData(parsedUser);
      } catch (error) {
        console.error("Error al recuperar los datos del usuario:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Tu perfil</h1>
          <p className="text-muted-foreground">
            Gestiona tu información personal y preferencias.
          </p>
        </div>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="personal">Información personal</TabsTrigger>
            <TabsTrigger value="datos_fisicos">Datos físicos</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-1">
                <CardContent className="p-6 flex flex-col items-center">
                  <div className="relative mb-4">
                    <Avatar className="h-32 w-32">
                      <AvatarImage
                        src={
                          userData?.avatar ||
                          "/placeholder.svg?height=128&width=128"
                        }
                        alt={userData?.name || "Usuario"}
                      />
                      <AvatarFallback className="text-3xl">
                        {userData?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <h3 className="text-xl font-bold">
                    {userData?.name || "Usuario"}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {userData?.email || "Sin correo electrónico"}
                  </p>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Información personal</CardTitle>
                    <CardDescription>
                      Actualiza tus datos personales
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setEditing(!editing)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre</Label>
                      <Input
                        id="nombre"
                        defaultValue={userData?.name || ""}
                        disabled={!editing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue={userData?.email || ""}
                      disabled={!editing}
                    />
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
                        <SelectItem value="no-especificar">
                          Prefiero no especificar
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edad">Edad</Label>
                    <Input
                      id="edad"
                      type="number"
                      defaultValue={userData?.edad || ""}
                      disabled={!editing}
                    />
                  </div>
                </CardContent>
                <CardFooter
                  className={editing ? "flex justify-end gap-2" : "hidden"}
                >
                  <Button variant="outline" onClick={() => setEditing(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={() => setEditing(false)}>
                    Guardar cambios
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="datos_fisicos">
            <Card className="md:col-span-3">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Datos físicos y objetivos</CardTitle>
                  <CardDescription>
                    Actualiza tus medidas y objetivos de entrenamiento
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setEditingDatosFisicos(!editingDatosFisicos)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="peso">Peso (kg)</Label>
                    <Input
                      id="peso"
                      type="number"
                      defaultValue="78.5"
                      disabled={!editingDatosFisicos}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="altura">Altura (cm)</Label>
                    <Input
                      id="altura"
                      type="number"
                      defaultValue="178"
                      disabled={!editingDatosFisicos}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="imc">IMC</Label>
                    <Input
                      id="imc"
                      type="number"
                      defaultValue="24.7"
                      disabled={true}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cintura">Cintura (cm)</Label>
                    <Input
                      id="cintura"
                      type="number"
                      defaultValue="85"
                      disabled={!editingDatosFisicos}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pecho">Pecho (cm)</Label>
                    <Input
                      id="pecho"
                      type="number"
                      defaultValue="100"
                      disabled={!editingDatosFisicos}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brazos">Brazos (cm)</Label>
                    <Input
                      id="brazos"
                      type="number"
                      defaultValue="35"
                      disabled={!editingDatosFisicos}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="piernas">Piernas (cm)</Label>
                    <Input
                      id="piernas"
                      type="number"
                      defaultValue="55"
                      disabled={!editingDatosFisicos}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="objetivo">Objetivo</Label>
                    <Select
                      defaultValue="hipertrofia"
                      disabled={!editingDatosFisicos}
                    >
                      <SelectTrigger id="objetivo">
                        <SelectValue placeholder="Selecciona tu objetivo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="perder-peso">Perder peso</SelectItem>
                        <SelectItem value="hipertrofia">
                          Ganar masa muscular
                        </SelectItem>
                        <SelectItem value="tonificar">
                          Tonificar el cuerpo
                        </SelectItem>
                        <SelectItem value="resistencia">
                          Mejorar resistencia
                        </SelectItem>
                        <SelectItem value="fuerza">Aumentar fuerza</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter
                className={
                  editingDatosFisicos ? "flex justify-end gap-2" : "hidden"
                }
              >
                <Button
                  variant="outline"
                  onClick={() => setEditingDatosFisicos(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={() => setEditingDatosFisicos(false)}>
                  Guardar cambios
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
