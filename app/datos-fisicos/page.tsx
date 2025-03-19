"use client";

import { useState } from "react";
import Link from "next/link";
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

import { Dumbbell } from "lucide-react";
import { createPersonalData } from "../../services/user/personal_data";
import HealthForm from "./datosMedicos/datos_medicos";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PersonalDataForm from "./datosPersonales/datos_personales";

export default function DatosFisicosPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    edad: "",
    genero: "",
    condicion_medica: "",
    condicionesDetalles: "",
    lesionesBool: "",
    lesionesDetalles: "",
    confirmacion: false,
  });


  // Manejar cambios en los inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Manejar cambios en el RadioGroup
  const handleGeneroChange = (value: string) => {
    setFormData((prev) => ({ ...prev, genero: value }));
  };

  // Enviar datos personales
  const handleSubmitPersonalData = async () => {
    console.log("Ejecutando handleSubmitPersonalData...");
    try {
      console.log("Datos personales enviados:", formData);
      setStep(2); // Cambia al paso 2
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  // Enviar datos médicos
  const handleSubmitHealthData = async () => {
    console.log("Datos médicos enviados:", formData);
    setStep(3);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/30">
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2">
        <div className="h-8 w-8 rounded-full gradient-purple flex items-center justify-center">
          <Dumbbell className="h-4 w-4 text-white" />
        </div>
        <span className="font-bold text-xl">FitPro</span>
      </Link>

      <div className="w-full max-w-md">
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-1/3 h-2 rounded-full mx-1 ${
                  i <= step ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
          <div className="text-center text-sm text-muted-foreground">
            Paso {step} de 3:{" "}
            {step === 1
              ? "Información personal"
              : step === 2
              ? "Condiciones médicas"
              : "Confirmación"}
          </div>
        </div>

        {step === 1 && (
        <PersonalDataForm handleGeneroChange={handleGeneroChange} formData={formData}
         setFormData={setFormData}
         onSubmit={handleSubmitPersonalData} />
        )}
        {step === 2 && (
          <Card className="w-full shadow-lg">
            <CardHeader>
              <CardTitle>Objetivos de entrenamiento</CardTitle>
              <CardDescription>
                Selecciona tus objetivos para personalizar tu rutina
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="objetivo-principal">Objetivo principal</Label>
                <Select>
                  <SelectTrigger id="objetivo-principal">
                    <SelectValue placeholder="Selecciona tu objetivo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="perder-peso">Perder peso</SelectItem>
                    <SelectItem value="ganar-musculo">
                      Ganar masa muscular
                    </SelectItem>
                    <SelectItem value="tonificar">
                      Tonificar el cuerpo
                    </SelectItem>
                    <SelectItem value="resistencia">
                      Mejorar resistencia
                    </SelectItem>
                    <SelectItem value="fuerza">Aumentar fuerza</SelectItem>
                    <SelectItem value="flexibilidad">
                      Mejorar flexibilidad
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="frecuencia">
                  Frecuencia de entrenamiento semanal
                </Label>
                <Select>
                  <SelectTrigger id="frecuencia">
                    <SelectValue placeholder="Selecciona la frecuencia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 días por semana</SelectItem>
                    <SelectItem value="3">3 días por semana</SelectItem>
                    <SelectItem value="4">4 días por semana</SelectItem>
                    <SelectItem value="5">5 días por semana</SelectItem>
                    <SelectItem value="6">6 días por semana</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duracion">
                  Duración preferida de entrenamiento
                </Label>
                <Select>
                  <SelectTrigger id="duracion">
                    <SelectValue placeholder="Selecciona la duración" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutos</SelectItem>
                    <SelectItem value="45">45 minutos</SelectItem>
                    <SelectItem value="60">60 minutos</SelectItem>
                    <SelectItem value="90">90 minutos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="equipamiento">Equipamiento disponible</Label>
                <Select>
                  <SelectTrigger id="equipamiento">
                    <SelectValue placeholder="Selecciona el equipamiento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ninguno">
                      Sin equipamiento (en casa)
                    </SelectItem>
                    <SelectItem value="basico">
                      Equipamiento básico (mancuernas, bandas)
                    </SelectItem>
                    <SelectItem value="gimnasio">
                      Acceso a gimnasio completo
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Atrás
              </Button>
              <Button onClick={() => setStep(3)}>Continuar</Button>
            </CardFooter>
          </Card>
        )}
        {step === 3 && (
          <HealthForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmitHealthData}
          />
        )}
      </div>
    </div>
  );
}
