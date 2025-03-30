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
import { getID } from "@/services/login/authService";
import {
  getPersonalDataById,
  updatePersonalData,
} from "@/services/user/personal_data";

export default function PerfilPage() {
  interface UserData {
    id?: number;
    google_id?: string;
    avatar?: string;
    name?: string;
    email?: string;
    edad?: number;
    genero?: string;
  }

  const [userData, setUserData] = useState<UserData | null>(null);
  const [userID, setUserID] = useState<number | null>(null);
  const [editing, setEditing] = useState(false);
  

  async function handleSaveChanges(
    userData: UserData | null,
    setUserData: React.Dispatch<React.SetStateAction<UserData | null>>,
    setEditing: React.Dispatch<React.SetStateAction<boolean>>
  ) {
    try {
      const updatedData = {
        user_id: userID,
        name: (document.getElementById("nombre") as HTMLInputElement)?.value,
        edad: parseInt(
          (document.getElementById("edad") as HTMLInputElement)?.value || "0"
        ),
        genero: userData?.genero,
      };

      console.log("Datos actualizados:", updatedData);

      if (userData?.id) {
        await updatePersonalData(userID, updatedData);
        console.log("Datos actualizados en el backend:", updatedData);
        // Actualizar el estado local
        setUserData((prev) => ({
          ...prev,
          ...updatedData,
        }));
        setEditing(false);

        console.log("Datos actualizados correctamente");
      } else {
        console.error("ID del usuario no disponible");
      }
    } catch (error) {
      console.error("Error al actualizar los datos personales:", error);
    } finally {
      // Cerrar modo de edición
      setEditing(false);
    }
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        setUserData(parsedUser);

        const fetchedId = await getID(parsedUser.id);
        setUserID(fetchedId);
        console.log("ID del usuario", fetchedId);

        const personalData = await getPersonalDataById(fetchedId);
        console.log("Datos personales:", personalData);

        setUserData((prevData) => ({
          ...prevData,
          edad: personalData.edad,
          genero: personalData.genero,
        }));
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
                    <Select
                      value={userData?.genero || "Otro"}
                      onValueChange={(value) =>
                        setUserData((prev) => ({ ...prev, genero: value }))
                      }
                      disabled={!editing}
                    >
                      <SelectTrigger id="genero">
                        <SelectValue placeholder="Selecciona tu género">
                          {userData?.genero === "M"
                            ? "Masculino"
                            : userData?.genero === "F"
                            ? "Femenino"
                            : "Otro"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M">Masculino</SelectItem>
                        <SelectItem value="F">Femenino</SelectItem>
                        <SelectItem value="Otro">Otro</SelectItem>
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
                  <Button
                    onClick={() =>
                      handleSaveChanges(userData, setUserData, setEditing)
                    }
                  >
                    Guardar cambios
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
