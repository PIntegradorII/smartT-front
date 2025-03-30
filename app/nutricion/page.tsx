"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { useState, useRef } from "react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import Daily_nutrition from "./daily_nutrition";
import { speech_to_text } from "@/services/watson/watson";
import audioBufferToWav from 'audiobuffer-to-wav';


export default function Nutricion() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);


  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const options = {
        mimeType: 'audio/webm;codecs=opus', // Formato compatible
        audioBitsPerSecond: 128000
      };
      
      const mediaRecorder = new MediaRecorder(stream, options);

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const webmBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        // Convertir a WAV
        try {
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const arrayBuffer = await webmBlob.arrayBuffer();
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          const wavBuffer = audioBufferToWav(audioBuffer);
          const wavBlob = new Blob([wavBuffer], { type: 'audio/wave' });
          
          setAudioBlob(wavBlob);
          setIsAudioReady(true);
        } catch (conversionError) {
          console.error("Error en conversión a WAV:", conversionError);
          // Fallback: usar el original si la conversión falla
          setAudioBlob(webmBlob);
          setIsAudioReady(true);
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

  const resetRecording = () => {
    setAudioBlob(null);
    setIsAudioReady(false);
    setTranscription(null);
  };

  const sendAudioToBackend = async () => {
    if (!audioBlob) {
      console.error("No hay audio disponible para enviar.");
      return;
    }

    try {
      const response = await speech_to_text(audioBlob);
      setTranscription(response.transcript);
      console.log("Texto transcrito:", response.transcript);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error al enviar el audio al backend:", error.message);
      } else {
        console.error("Error al enviar el audio al backend:", error);
      }
    }
  };

  const downloadAudio = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "debug_audio.wav";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };
  

  return (
    <MainLayout>
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-2xl font-bold">Grabar Audio</h1>
        <div className="flex flex-col items-center gap-4">
          <Button
            size="lg"
            className={`rounded-full w-16 h-16 ${
              isRecording ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
            }`}
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? <MicOff className="h-6 w-6 text-white" /> : <Mic className="h-6 w-6 text-white" />}
          </Button>
          <p className="text-sm text-muted-foreground">
            {isRecording ? "Haz clic para detener la grabación" : "Haz clic para comenzar a grabar"}
          </p>
        </div>

        {isAudioReady && (
          <>
            <audio controls src={URL.createObjectURL(audioBlob!)} className="mb-4"></audio>
            <div className="flex gap-4">
              <Button onClick={sendAudioToBackend} className="bg-blue-500 hover:bg-blue-600">
                Enviar Audio
              </Button>
              <Button onClick={resetRecording} className="bg-gray-500 hover:bg-gray-600">
                Resetear
              </Button>
              <Button onClick={downloadAudio} className="bg-green-500 hover:bg-green-600">
                Descargar Audio
              </Button>
            </div>
          </>
        )}

        {transcription && (
          <div className="mt-4 p-4 border rounded-lg bg-gray-100 w-full max-w-lg">
            <h2 className="text-lg font-bold">Transcripción del audio:</h2>
            <p className="text-gray-700">{transcription}</p>
          </div>
        )}

        {isAudioReady && <Daily_nutrition />}
      </div>
    </MainLayout>
  );
}
