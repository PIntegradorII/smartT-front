"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getID } from "../../../services/login/authService";
import { createPhysicalData } from "../../../services/user/physical_data";


export interface DatosFisicosFormProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  onSubmit: () => void;
}

const DatosFisicosForm: React.FC<DatosFisicosFormProps> = ({
  formData,
  setFormData,
  onSubmit,
}) => {
  const [imc, setImc] = useState<number | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userData = localStorage.getItem("user")
          ? JSON.parse(localStorage.getItem("user") as string)
          : null;

        if (userData?.id) {
          // Si `id` está disponible, llama al servicio para obtener el ID
          const fetchedId = await getID(userData.id);
          setUserId(fetchedId);
        } else {
          console.error("No se encontró id en userData.");
        }
      } catch (error) {
        console.error("Error al recuperar el ID del usuario:", error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const peso = parseFloat(formData.peso);
    const altura = parseFloat(formData.altura);

    if (peso && altura) {
      const alturaMetros = altura / 100;
      const calculoIMC = peso / (alturaMetros * alturaMetros);
      setImc(parseFloat(calculoIMC.toFixed(2)));
      setFormData((prev: any) => ({ ...prev, imc: calculoIMC.toFixed(2) }));
    }
  }, [formData.peso, formData.altura]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [id]: value }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.peso) newErrors.peso = "El peso es obligatorio.";
    if (!formData.altura) newErrors.altura = "La altura es obligatoria.";
    if (!formData.cintura) newErrors.cintura = "La cintura es obligatoria.";
    if (!formData.pecho) newErrors.pecho = "El pecho es obligatorio.";
    if (!formData.brazos) newErrors.brazos = "Los brazos son obligatorios.";
    if (!formData.piernas) newErrors.piernas = "Las piernas son obligatorias.";
    if (!formData.objetivo) newErrors.objetivo = "El objetivo es obligatorio.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendDataToService = async () => {
    try {
      if (!userId) throw new Error("ID de usuario no disponible");
  
      const datosAEnviar = {
        user_id: userId.toString(),
        peso: formData.peso,
        altura: formData.altura,
        imc: formData.imc,
        cintura: formData.cintura,
        pecho: formData.pecho,
        brazos: formData.brazos,
        piernas: formData.piernas,
        objetivo: formData.objetivo,
      };
  
      const response = await createPhysicalData(datosAEnviar);
  
      console.log("Datos físicos enviados:", response);
    } catch (error) {
      console.error("Error al enviar datos físicos:", error);
    }
  };
  

  const handleSubmit = async () => {
    if (validateForm()) {
      await sendDataToService();
      onSubmit();
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle>Datos físicos y objetivos</CardTitle>
        <CardDescription>
          Ingresa tus medidas y selecciona tu objetivo de entrenamiento
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="peso">Peso (kg)</Label>
            <Input
              id="peso"
              type="number"
              value={formData.peso || ""}
              onChange={handleInputChange}
              className={errors.peso ? "border-red-500" : ""}
            />
            {errors.peso && <p className="text-red-500 text-sm">{errors.peso}</p>}
          </div>
          <div>
            <Label htmlFor="altura">Altura (cm)</Label>
            <Input
              id="altura"
              type="number"
              value={formData.altura || ""}
              onChange={handleInputChange}
              className={errors.altura ? "border-red-500" : ""}
            />
            {errors.altura && <p className="text-red-500 text-sm">{errors.altura}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="imc">IMC</Label>
          <Input id="imc" value={imc || ""} disabled />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="cintura">Cintura (cm)</Label>
            <Input
              id="cintura"
              type="number"
              value={formData.cintura || ""}
              onChange={handleInputChange}
              className={errors.cintura ? "border-red-500" : ""}
            />
            {errors.cintura && <p className="text-red-500 text-sm">{errors.cintura}</p>}
          </div>
          <div>
            <Label htmlFor="pecho">Pecho (cm)</Label>
            <Input
              id="pecho"
              type="number"
              value={formData.pecho || ""}
              onChange={handleInputChange}
              className={errors.pecho ? "border-red-500" : ""}
            />
            {errors.pecho && <p className="text-red-500 text-sm">{errors.pecho}</p>}
          </div>
          <div>
            <Label htmlFor="brazos">Brazos (cm)</Label>
            <Input
              id="brazos"
              type="number"
              value={formData.brazos || ""}
              onChange={handleInputChange}
              className={errors.brazos ? "border-red-500" : ""}
            />
            {errors.brazos && <p className="text-red-500 text-sm">{errors.brazos}</p>}
          </div>
          <div>
            <Label htmlFor="piernas">Piernas (cm)</Label>
            <Input
              id="piernas"
              type="number"
              value={formData.piernas || ""}
              onChange={handleInputChange}
              className={errors.piernas ? "border-red-500" : ""}
            />
            {errors.piernas && <p className="text-red-500 text-sm">{errors.piernas}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="objetivo">Objetivo fitness</Label>
          <Select
            onValueChange={(value) => handleSelectChange("objetivo", value)}
          >
            <SelectTrigger
              id="objetivo"
              className={errors.objetivo ? "border-red-500" : ""}
            >
              <SelectValue placeholder="Selecciona tu objetivo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="perder_grasa">Pérdida de grasa</SelectItem>
              <SelectItem value="hipertrofia">Hipertrofia</SelectItem>
              <SelectItem value="resistencia">Resistencia</SelectItem>
              <SelectItem value="salud_general">Salud general</SelectItem>
            </SelectContent>
          </Select>
          {errors.objetivo && <p className="text-red-500 text-sm">{errors.objetivo}</p>}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button className="w-full" onClick={handleSubmit}>Continuar</Button>
      </CardFooter>
    </Card>
  );
};

export default DatosFisicosForm;
