"use client";

import { useEffect, useState, Key } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import Image from "next/image";
import { getTrainingPlanByGoogleId } from "@/services/training/rutinas";
import { regenerateRoutineDay } from "@/services/training/trainingService";
import { getID } from "../../services/login/authService";
import { GIFS_EJERCICIOS } from "@/app/rutina/ejercicios";
import { generarAudioResumen } from "@/services/elevenlabs/generarAudio";

interface RutinaProps {
  datosHistoricos: any;
  mostrarDetalles?: boolean;
}

export default function RutinaPage({ datosHistoricos, mostrarDetalles = false }: RutinaProps) {
  const [activeDay, setActiveDay] = useState<keyof typeof dayMapping>("lunes");
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const defaultImage = "/images/default-exercise.jpg";

  const dayMapping = {
    "lunes": "lunes",
    "martes": "martes",
    "miércoles": "miercoles",
    "jueves": "jueves",
    "viernes": "viernes",
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://raw.githack.com/eKoopmans/html2pdf/master/dist/html2pdf.bundle.min.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

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
      const response = mostrarDetalles ? datosHistoricos : await getTrainingPlanByGoogleId(googleId);

      if (!response || Object.keys(response).length === 0) {
        setErrorMessage("No hay registros disponibles.");
        setData(null);
      } else {
        setData(response);
      }
    } catch (error) {
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
      setErrorMessage("No se pudo regenerar la rutina.");
    } finally {
      setTimeout(() => setIsUpdating(false), 2000);
    }
  };

  const selectedDay = data?.[dayMapping[activeDay]];
  useEffect(() => {
    const generarAudio = async () => {
      if (selectedDay) {
        const userData = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null;
        const usuario = userData?.name || "Usuario";
        const url = await generarAudioResumen(selectedDay, usuario, activeDay);
        setAudioUrl(url);
      }
    };
    generarAudio();
  }, [selectedDay, activeDay]);
  


  const generateRoutineHTML = () => {
    if (!data) return "<p>No hay datos disponibles.</p>";

    const fechaActual = new Date().toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const primaryColor = "#4F46E5";
    const secondaryColor = "#F9FAFB";
    const textColor = "#111827";

    const userData = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null;
    const nombreUsuario = userData?.name || "Usuario";

    const days = Object.keys(dayMapping);

    let html = `
    <div style="padding:15px; font-family:Arial, sans-serif; color:${textColor}; background-color:${secondaryColor};">
      <div style="text-align:center; margin-bottom:20px;">
        <h1 style="color:${primaryColor}; margin-bottom:8px;">Rutina Semanal de Entrenamiento</h1>
        <p><strong>Nombre:</strong> ${nombreUsuario}</p>
        <p><strong>Fecha de exportación:</strong> ${fechaActual}</p>
      </div>`;

    for (let i = 0; i < days.length; i += 2) {
      const isSingleColumn = i + 1 >= days.length;

      html += `<div style="display:flex; gap:10px; margin-bottom:30px;${!isSingleColumn ? "page-break-after:always;" : ""}">`;

      for (let j = i; j < i + 2 && j < days.length; j++) {
        const day = days[j];
        const dayData = data[dayMapping[day as keyof typeof dayMapping]];

        if (dayData) {
          html += `
          <div style="flex:${isSingleColumn ? "0 0 50%" : "1"}; background:#FFF; padding:15px; border-radius:8px; border:1px solid #E5E7EB;">
            <h2 style="color:${primaryColor}; border-bottom:2px solid ${primaryColor}; padding-bottom:5px; margin-bottom:10px;">
              ${day.charAt(0).toUpperCase() + day.slice(1)}
            </h2>
            <p><strong>Músculos:</strong> ${dayData.musculos.join(", ")}</p>
            <ul style="list-style-type:none; padding:0;">`;

          dayData.ejercicios.forEach((ejercicio: any, idx: number) => {
            html += `
              <li style="background-color:${secondaryColor}; padding:8px; margin-top:8px; border-radius:6px;">
                <strong>${idx + 1}. ${ejercicio.ejercicio}</strong><br/>
                Series: ${ejercicio.series} | Repeticiones: ${ejercicio.repeticiones}
              </li>`;
          });

          html += `</ul></div>`;
        }
      }

      if (isSingleColumn) {
        html += `<div style="flex:0 0 50%;"></div>`;
      }

      html += `</div>`;
    }

    html += `</div>`;
    return html;
  };

  const exportPDF = () => {
    const html = generateRoutineHTML();
    const options = {
      margin: 0.4,
      filename: "rutina_semanal.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "letter", orientation: "landscape" },
    };
    // @ts-ignore
    html2pdf().from(html).set(options).save();
  };

  const contenido = (
    <div className="flex flex-col gap-6">
      {!mostrarDetalles && (
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Tu rutina de entrenamiento</h1>
          <p className="text-muted-foreground">Personalizada según tus objetivos y condición física.</p>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {Object.keys(dayMapping).map((day) => (
          <button
            key={day}
            onClick={() => setActiveDay(day as keyof typeof dayMapping)}
            className={`rounded-full px-6 py-2 text-sm font-medium transition-colors ${
              activeDay === day
                ? "bg-primary text-white"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {day.charAt(0).toUpperCase() + day.slice(1)}
          </button>
        ))}
      </div>

      {!mostrarDetalles && (
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={exportPDF}
            className="rounded-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Exportar rutina semanal PDF
          </button>

          <button
            onClick={handleButtonClick}
            className={`rounded-full px-6 py-2 text-sm font-medium text-white transition-all shadow-md ${
              isUpdating
                ? "bg-gradient-to-r from-purple-500 to-purple-700 animate-pulse"
                : "bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900"
            } disabled:opacity-50`}
            disabled={isUpdating}
          >
            {isUpdating ? "Regenerando..." : "Regenerar rutina del día"}
          </button>
        </div>
      )}

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {isLoading ? (
        <p>Cargando rutina...</p>
      ) : selectedDay ? (
        <div className="border rounded-lg p-4 bg-white">
          <div className="flex justify-between items-start mb-4 gap-4 flex-wrap">
          {/* Columna izquierda: título y músculos */}
          <div className="flex flex-col">
            <h2 className="text-xl font-bold">{selectedDay.titulo}</h2>
            <p className="text-gray-500">Músculos: {selectedDay.musculos.join(", ")}</p>
          </div>

          {/* Columna derecha: resumen en audio */}
          {audioUrl && (
            <div className="flex flex-col items-start">
              <span className="text-l text-gray-500 mb-1">Resumen de la rutina:</span>
              <audio src={audioUrl} controls />
            </div>
          )}
        </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {selectedDay.ejercicios.map((ejercicio: any, index: Key) => (
              <div key={index} className="border rounded-lg p-4 bg-white flex flex-col items-center">
                <h3 className="text-lg font-semibold mb-1">{ejercicio.ejercicio}</h3>
                <Image
                  src={GIFS_EJERCICIOS[ejercicio.ejercicio] || defaultImage}
                  alt={ejercicio.ejercicio}
                  width={150}
                  height={150}
                  className="rounded-md mb-2"
                />
                <p>Series: {ejercicio.series}</p>
                <p>Repeticiones: {ejercicio.repeticiones}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>No hay rutina disponible para este día.</p>
      )}
    </div>
  );

  return mostrarDetalles ? contenido : <MainLayout>{contenido}</MainLayout>;
}
