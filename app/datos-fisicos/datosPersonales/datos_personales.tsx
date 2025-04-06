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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { createPersonalData } from "@/services/user/personal_data";
import { getID } from "../../../services/login/authService";
export interface HealthFormProps {
  handleGeneroChange: (value: string) => void;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  onSubmit: () => void;
}

const PersonalDataForm: React.FC<HealthFormProps> = ({
  handleGeneroChange,
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev: any) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmitPersonalData = async () => {
    try {
      if (!userId) {
        throw new Error("No se encontró el ID del usuario");
      }

      const datosAEnviar = {
        id: 1,
        user_id: userId,
        edad: parseInt(formData.edad, 10),
        genero:
          formData.genero === "masculino"
            ? "M"
            : formData.genero === "femenino"
            ? "F"
            : "Otro",
      };
      const response = await createPersonalData(datosAEnviar);
      onSubmit();
    } catch (error) {
      console.error("Error al enviar los datos personales:", error);
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle>Información personal</CardTitle>
        <CardDescription>
          Ingresa tu información personal para conocerte mejor
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="edad">Edad</Label>
          <Input
            id="edad"
            type="number"
            placeholder="30"
            value={formData.edad}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label>Género</Label>
          <RadioGroup
            value={formData.genero}
            onValueChange={handleGeneroChange}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="masculino" id="masculino" />
              <Label htmlFor="masculino">Masculino</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="femenino" id="femenino" />
              <Label htmlFor="femenino">Femenino</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="otro" id="otro" />
              <Label htmlFor="otro">Otro</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleSubmitPersonalData}>
          Continuar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PersonalDataForm;
