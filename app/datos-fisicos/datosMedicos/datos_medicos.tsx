"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createHealthData } from "@/services/user/health_data";
import { getID } from "@/services/login/authService";
export interface HealthFormProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  onSubmit: () => void;
}
import { useRouter } from "next/navigation"; // Importa useRouter
const HealthForm: React.FC<HealthFormProps> = ({
  formData,
  setFormData,
  onSubmit,
}) => {
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userData = localStorage.getItem("user")
          ? JSON.parse(localStorage.getItem("user") as string)
          : null;
        const fetchedId = await getID(userData.id);
        setUserId(fetchedId);
        if (userData?.id) {
          // Si `google_id` está disponible, llama al servicio para obtener el ID
          const fetchedId = await getID(userData.id);
          setUserId(fetchedId);
        } else {
          console.error("No se encontró google_id en userData.");
        }
      } catch (error) {
        console.error("Error al recuperar el ID del usuario:", error);
      }
    };
  
    fetchUserId();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev: any) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [id]: value }));
  };
  const router = useRouter();
  const handleSubmitHealthData = async () => {
    try {
      if (!userId) {
        throw new Error("No se encontró el ID del usuario");
      }

      const datosAEnviar = {
        id: "3", // ID como texto
        user_id: userId.toString(), // Convertir a texto
        tiene_condiciones: formData.condicion_medica === "si" ? "si" : "no",
        detalles_condiciones: formData.condicionesDetalles?.trim() || "",
        lesiones: formData.lesionesBool || "no",
        confirmacion: formData.confirmacion ? "si" : "no",
      };

      console.log("Datos a enviar:", datosAEnviar);

      const response = await createHealthData(datosAEnviar);
      console.log("Respuesta del servidor:", response);
      Cookies.set("ruta", "1", { expires: 1, path: "/" });
      console.log("Cookie 'ruta' actualizada");

      router.push("/dashboard");

      onSubmit();
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          "Error al enviar los datos:",
          (error as any).response?.data || error.message
        );
      } else {
        console.error("Error desconocido:", error);
      }
    }
  };
    
  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle>Condiciones médicas</CardTitle>
        <CardDescription>
          Información importante para adaptar tu rutina a tus necesidades
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="condiciones">¿Tienes alguna condición médica?</Label>
          <Select onValueChange={(value) => handleSelectChange("condicion_medica", value)}>
            <SelectTrigger id="condiciones">
              <SelectValue placeholder="Selecciona una opción" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no">No tengo condiciones médicas</SelectItem>
              <SelectItem value="si">Sí, tengo condiciones médicas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="condicionesDetalles">
            Detalles de condiciones médicas (opcional)
          </Label>
          <textarea
            id="condicionesDetalles"
            value={formData.condicionesDetalles}
            onChange={handleInputChange}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Describe cualquier condición médica, lesión o limitación que debamos tener en cuenta"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lesionesBool">¿Tienes alguna lesión o área problemática?</Label>
          <Select onValueChange={(value) => handleSelectChange("lesionesBool", value)}>
            <SelectTrigger id="lesionesBool">
              <SelectValue placeholder="Selecciona una opción" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no">No tengo lesiones</SelectItem>
              <SelectItem value="espalda">Problemas de espalda</SelectItem>
              <SelectItem value="rodillas">Problemas de rodillas</SelectItem>
              <SelectItem value="hombros">Problemas de hombros</SelectItem>
              <SelectItem value="otro">Otro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="confirmacion"
              checked={formData.confirmacion}
              onChange={handleInputChange}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="confirmacion">
              Confirmo que la información proporcionada es correcta y que consultaré con un médico
              antes de comenzar cualquier programa de ejercicio.
            </Label>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSubmitHealthData}>Enviar</Button>
      </CardFooter>
    </Card>
  );
};

export default HealthForm;