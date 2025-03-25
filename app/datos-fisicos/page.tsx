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
import { createPersonalData } from "@/services/user/personal_data";
import HealthForm from "./datosMedicos/datos_medicos";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PersonalDataForm from "./datosPersonales/datos_personales";
import DatosFisicosForm from "./datosFisicos/datos_fisicos";

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
    try {
      setStep(2); // Cambia al paso 2
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  // Enviar datos médicos
  const handleSubmitHealthData = async () => {
    setStep(3);
    
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/30">
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2">
        <div className="h-8 w-8 rounded-full gradient-purple flex items-center justify-center">
          <Dumbbell className="h-4 w-4 text-white" />
        </div>
        <span className="font-bold text-xl">SmartTrainer</span>
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
          <DatosFisicosForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={() => setStep(3)}
          />
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