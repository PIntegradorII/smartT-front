"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { createHealthData } from "../../../services/user/health_data";
export interface HealthFormProps {
    formData: any;
    setFormData: React.Dispatch<React.SetStateAction<any>>;
    onSubmit: () => void;
  }
  
  const HealthForm: React.FC<HealthFormProps> = ({
    formData,
    setFormData,
    onSubmit,
  }) => {
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
    const handleSubmitHealthData = async () => {
      // Construir el objeto a enviar basado en formData
      const datosAEnviar = {
        id: "3", // ID como texto
        user_id: "2", // ID de usuario como texto
        tiene_condiciones: formData.condicion_medica === "si" ? "si" : "no", // Convertido a texto
        detalles_condiciones: formData.condicionesDetalles?.trim() || "", // Asegurar que sea texto
        lesiones: formData.lesionesBool || "no", // Asegurar que sea texto
        confirmacion: formData.confirmacion ? "si" : "no", // Convertir el booleano a texto
      };
    
      console.log("Datos a enviar:", datosAEnviar);
    
      try {
        // Llamada al servicio para subir los datos
        const response = await createHealthData(datosAEnviar);
        console.log("Respuesta del servidor:", response);
    
        // Llamar a la función onSubmit para avanzar al siguiente paso
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
