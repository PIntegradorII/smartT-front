"use client";

import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import Image from "next/image";
import { getTrainingPlanByGoogleId } from "@/services/training/rutinas";
import { regenerateRoutineDay } from "@/services/training/trainingService";
import { getID } from "../../services/login/authService";
import { GIFS_EJERCICIOS } from "@/app/rutina/ejercicios";

interface RutinaProps {
  datosHistoricos: any;
  mostrarDetalles?: boolean; // Parámetro opcional
}
export default function RutinaPage({ datosHistoricos, mostrarDetalles = false }: RutinaProps) {
  const [activeDay, setActiveDay] = useState<keyof typeof dayMapping>("lunes");
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const defaultImage = "/images/default-exercise.jpg"; // Imagen por defecto

  const loadData = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const userData = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : null;
      if (!userData) {
        setErrorMessage("No se encontró información del usuario.");
        setData(null);
        return;
      }
      const googleId = userData.id;
      let response = [];
      if (mostrarDetalles) {
        response = datosHistoricos;
      } else {
        response = await getTrainingPlanByGoogleId(googleId);
      }
      if (!response || Object.keys(response).length === 0) {
        setErrorMessage("No hay registros disponibles.");
        setData(null);
      } else {
        setData(response);
      }
    } catch (error) {
      console.error("Error al cargar el resumen semanal:", error);
      setErrorMessage("Ocurrió un error al obtener la rutina.");
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [userId, activeDay]);

  const handleButtonClick = async () => {
    setIsUpdating(true);
    setErrorMessage(null);

    try {
      const userData = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : null;
      if (!userData) {
        setErrorMessage("No se encontró información del usuario.");
        setIsUpdating(false);
        return;
      }

      const fetchedId = await getID(userData.id);
      setUserId(fetchedId);

      const selectedRoutine = data?.[dayMapping[activeDay]];

      await regenerateRoutineDay(fetchedId, activeDay, selectedRoutine);
      await loadData();
    } catch (error) {
      console.error("Error al regenerar la rutina:", error);
      setErrorMessage("No se pudo regenerar la rutina.");
    } finally {
      setTimeout(() => setIsUpdating(false), 2000);
    }
  };

  const dayMapping = {
    "lunes": "lunes",
    "martes": "martes",
    "miércoles": "miercoles",
    "jueves": "jueves",
    "viernes": "viernes",
  };

  const selectedDay = data?.[dayMapping[activeDay]];

  const contenido = (
    <div className="flex flex-col gap-6">
      {!mostrarDetalles && (
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Tu rutina de entrenamiento</h1>
          <p className="text-muted-foreground">Personalizada según tus objetivos y condición física.</p>
        </div>)}
      {/* Selector de días */}
      <div className="flex flex-wrap gap-2">
        {Object.keys(dayMapping).map((day) => (
          <button
            key={day}
            onClick={() => setActiveDay(day as keyof typeof dayMapping)}
            className={`rounded-full px-6 py-2 text-sm font-medium transition-colors ${activeDay === day
                ? "bg-primary text-white"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
          >
            {day.charAt(0).toUpperCase() + day.slice(1)}
          </button>
        ))}
      </div>

      {!mostrarDetalles && (<button
        onClick={handleButtonClick}
        className={`relative flex justify-center items-center gap-2 rounded-full px-6 py-2 text-sm font-medium text-white transition-all shadow-md 
          ${isUpdating ? "bg-gradient-to-r from-purple-500 to-purple-700 animate-pulse" : "bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900"}
          disabled:opacity-50`}
        disabled={isUpdating}
      >
        {isUpdating ? (
          <>
            <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0116 0"></path>
            </svg>
            <span>Regenerando...</span>
          </>
        ) : (
          "Regenerar rutina del día"
        )}
      </button>)}
      {/* Manejo de errores */}
      {errorMessage ? (
        <p className="text-red-500">{errorMessage}</p>
      ) : isLoading ? (
        <p>Cargando rutina...</p>

      ) : selectedDay ? (
        <div className="border rounded-lg p-4 bg-white">
          <h2 className="text-xl font-bold">{selectedDay.titulo}</h2>
          <p className="text-gray-500">Músculos: {selectedDay.musculos.join(", ")}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {selectedDay.ejercicios.map((ejercicio: {
              ejercicio: string;
              series: string;
              repeticiones: string;
              imagen?: string;
            }, index: Key | null | undefined) => {
              return (
                <div key={index} className="border rounded-lg overflow-hidden bg-white p-4 flex flex-col items-center">
                  <h3 className="text-lg font-semibold text-center mb-1">{ejercicio.ejercicio}</h3>
                  <Image
                    src={GIFS_EJERCICIOS[ejercicio.ejercicio] || defaultImage}
                    alt={`Imagen de ${ejercicio.ejercicio}`}
                    width={150}
                    height={150}
                    className="rounded-md mb-2"
                  />
                  <p className="text-sm text-gray-500">Series: {ejercicio.series}</p>
                  <p className="text-sm text-gray-500">Repeticiones: {ejercicio.repeticiones}</p>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <p>No hay rutina disponible para este día.</p>
      )}
    </div>
  );
  return mostrarDetalles ? contenido : <MainLayout>{contenido}</MainLayout>;

}
