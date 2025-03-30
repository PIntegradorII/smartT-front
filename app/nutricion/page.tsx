"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { useState, useRef, useEffect } from "react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import Daily_nutrition from "./daily_nutrition";
import { speech_to_text } from "@/services/watson/watson";
import audioBufferToWav from 'audiobuffer-to-wav';
import { getNutritionPlan } from '@/services/watson/watson'; 
import { Loader2 } from "lucide-react"; // Icono de loader

export default function Nutricion() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [google_id, setUserId] = useState<number | null>(null);
  const [hasNutritionPlan, setHasNutritionPlan] = useState(false); 
  const [showDailyNutrition, setShowDailyNutrition] = useState(false); // Estado para controlar la vista del plan nutricional.
  const [loading, setLoading] = useState(false); // Estado para el loader

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const options = { mimeType: 'audio/webm;codecs=opus', audioBitsPerSecond: 128000 };
      const mediaRecorder = new MediaRecorder(stream, options);

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const webmBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        try {
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const arrayBuffer = await webmBlob.arrayBuffer();
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          const wavBuffer = audioBufferToWav(audioBuffer);
          const wavBlob = new Blob([wavBuffer], { type: 'audio/wave' });
          
          setAudioBlob(wavBlob);
          sendAudioToBackend(wavBlob); 
        } catch (conversionError) {
          console.error("Error en conversión a WAV:", conversionError);
          setAudioBlob(webmBlob);
          sendAudioToBackend(webmBlob);  // Enviar el audio aunque haya fallado la conversión
        }
        audioChunksRef.current = [];
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      console.log("Grabación iniciada");
    } catch (error) {
      console.error("Error al iniciar la grabación:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendAudioToBackend = async (audio: Blob) => {
    if (!audio) {
      console.error("No hay audio disponible para enviar.");
      return;
    }

    try {
      setLoading(true); // Inicia el loader
      console.log("USUARIO", google_id);
      const response = await speech_to_text(audio, google_id);
      setTranscription(response.transcript);
      console.log("Texto transcrito:", response.transcript);

      // Aquí podemos verificar si el plan se generó correctamente y luego recargarlo.
      const plan = await getNutritionPlan(google_id);
      if (plan) {
        setHasNutritionPlan(true); // Si el plan existe, se debe mostrar la dieta
        setShowDailyNutrition(true); // Mostrar dieta generada
      } else {
        setHasNutritionPlan(false); // Si no se encuentra el plan
        setShowDailyNutrition(false); // No mostrar la dieta
      }
    } catch (error) {
      console.error("Error al enviar el audio al backend:", error);
    } finally {
      setLoading(false); // Detiene el loader
    }
  };

  // Verificación de si el usuario tiene un plan nutricional
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userData = localStorage.getItem("user")
          ? JSON.parse(localStorage.getItem("user") as string)
          : null;
        setUserId(userData.id);
      } catch (error) {
        console.error("Error al recuperar el ID del usuario:", error);
      }
    };

    const checkNutritionPlan = async () => {
      if (google_id) {
        try {
          setLoading(true); // Iniciar loader mientras verificamos el plan
          const plan = await getNutritionPlan(google_id); // Usamos la función para obtener el plan nutricional
          if (plan) {
            setHasNutritionPlan(true); // Si el plan existe, se debe mostrar la dieta
            setShowDailyNutrition(true); // Mostrar dieta ya generada
          } else {
            setHasNutritionPlan(false);
          }
        } catch (error) {
          console.error("No se pudo obtener el plan nutricional", error);
          setHasNutritionPlan(false); // Si hay un error, no tiene plan.
        } finally {
          setLoading(false); // Detener loader
        }
      }
    };

    fetchUserId();
    checkNutritionPlan(); // Comprobamos si tiene un plan nutricional.
  }, [google_id]);

  return (
    <MainLayout>
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-2xl font-bold">Generar tu Dieta</h1>

        {/* Instrucciones para el usuario */}
        {!hasNutritionPlan && !loading && !showDailyNutrition && (
          <div className="text-center text-lg text-muted-foreground">
            <p className="mb-4">Para generar tu plan nutricional, usa el botón de grabación y di qué tipo de dieta quieres. Por ejemplo, "Quiero una dieta balanceada".</p>
          </div>
        )}

        {/* Si el plan está siendo cargado, mostramos un loader */}
        {loading && (
          <div className="flex items-center justify-center">
            <Loader2 className="animate-spin h-12 w-12 text-gray-500" />
            <p className="ml-4">Cargando dieta...</p>
          </div>
        )}

        {/* Si ya tiene plan nutricional, mostramos la dieta */}
        {hasNutritionPlan && showDailyNutrition && google_id && !loading && (
          <div className="w-full max-w-lg">
            <Daily_nutrition google_id={google_id} />
          </div>
        )}

        {/* Mostrar solo el botón de grabar si no tiene plan nutricional o no se ha generado */}
        {!hasNutritionPlan && !showDailyNutrition && !loading && (
          <div className="flex flex-col items-center gap-4">
            <Button
              size="lg"
              className={`rounded-full w-16 h-16 ${isRecording ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
              onClick={isRecording ? stopRecording : startRecording}
            >
              {isRecording ? <MicOff className="h-6 w-6 text-white" /> : <Mic className="h-6 w-6 text-white" />}
            </Button>
            <p className="text-sm text-muted-foreground">
              {isRecording ? "Haz clic para detener la grabación" : "Haz clic para comenzar a grabar"}
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
