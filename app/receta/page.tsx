"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, MicOff, Play, Pause, RefreshCw, Download, Send, ChevronDown, ChevronUp } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"; // Asegúrate de tener este componente o reemplázalo con el de tu UI

import React, { useState,useEffect, useRef, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from "react";
import { Button } from "@/components/ui/button";
import { generarReceta } from "@/services/receta/receta";
import audioBufferToWav from 'audiobuffer-to-wav';
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getDataRecetaHistory } from "@/services/receta/hist_recetas";
interface Ingrediente {
  nombre: string;
  cantidad: string;
}

export default function Nutricion() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [recipeExpanded, setRecipeExpanded] = useState(true)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [dataHistorico, setDataHistorico] = useState<any>(null);
  const [ isLoading, setIsLoading] = useState(false);

  const loadData = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const userData = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : null;
        if (!userData) {
          setErrorMessage("No se encontró información del usuario.");
          setDataHistorico(null);
          return;
        }
        const googleId = userData.id;
        const response =  await getDataRecetaHistory(googleId);
  
        if (!response || Object.keys(response).length === 0) {
          setErrorMessage("No hay registros disponibles.");
          setDataHistorico(null);
        } else {
          setDataHistorico(response);
        }
      } catch (error) {
        setErrorMessage("Ocurrió un error al obtener la rutina.");
        setDataHistorico(null);
      } finally {
        setIsLoading(false);
      }
    };
  
    useEffect(() => {
      loadData();
    }, []);


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
      const userData = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : null;
      if (!userData) {
        setErrorMessage("No se encontró información del usuario.");
        setData(null);
        return;
      }
      const googleId = userData.id;
      const file = new File([audioBlob!], "audio.wav", { type: audioBlob!.type });
      const response = await generarReceta(googleId, file);
      setData(response);
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
      <Tabs defaultValue="grabar" className="w-full max-w-2xl">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="grabar">Grabar Audio</TabsTrigger>
          <TabsTrigger value="historial">Historial de Recetas</TabsTrigger>
        </TabsList>
        <TabsContent value="grabar">
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-2xl font-bold">Grabar Audio</h1>
            <div className="flex flex-col items-center gap-4">
              <Button
                size="lg"
                className={`rounded-full w-16 h-16 ${isRecording ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
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

            {data && (
              <div className="lg:col-span-1">
                <Card className="mt-4 shadow-md border-0">
                  <CardHeader className="pb-2 cursor-pointer" onClick={() => setRecipeExpanded(!recipeExpanded)}>
                    <div className="flex justify-between items-center">
                      <div>
                        <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                          Receta
                        </Badge>
                        <CardTitle className="text-xl mt-1">{data.recipe.nombre}</CardTitle> {/* Usamos el nombre de la receta */}
                      </div>
                      {recipeExpanded ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <CardDescription>Instrucciones para preparar un delicioso platillo</CardDescription>
                  </CardHeader>

                  {recipeExpanded && (
                    <CardContent className="pt-0">
                      <Separator className="my-4" />

                      <div className="space-y-4">
                        {/* Ingredientes */}
                        <div>
                          <h3 className="font-medium text-lg flex items-center">
                            <span className="inline-flex items-center justify-center rounded-full bg-amber-100 text-amber-800 h-6 w-6 text-sm mr-2">
                              1
                            </span>
                            Ingredientes
                          </h3>
                          <ul className="list-disc pl-10 mt-2 space-y-1 text-muted-foreground">
                            {data.recipe.ingredientes.map((ingrediente: { cantidad: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; nombre: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }, index: Key | null | undefined) => (
                              <li key={index}>
                                {ingrediente.cantidad} de {ingrediente.nombre}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Preparación */}
                        <div>
                          <h3 className="font-medium text-lg flex items-center">
                            <span className="inline-flex items-center justify-center rounded-full bg-amber-100 text-amber-800 h-6 w-6 text-sm mr-2">
                              2
                            </span>
                            Preparación
                          </h3>
                          <ol className="list-decimal pl-10 mt-2 space-y-2 text-muted-foreground">
                            {data.recipe.preparacion.map((paso: string, index: Key | null | undefined) => (
                              <li key={index}>{paso}</li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="historial">
  <div className="flex flex-col items-center gap-6">
    <h1 className="text-2xl font-bold">Historial de Recetas</h1>
    {isLoading ? (
      <p>Cargando...</p>
    ) : errorMessage ? (
      <p className="text-red-500">{errorMessage}</p>
    ) : (
      <div className="w-full max-w-3xl space-y-6">
        {dataHistorico?.map((item: any) => {
          let receta = null;
          try {
            receta = JSON.parse(item.recipe?.replace(/^\"|\"$/g, "").replace(/\\"/g, '"'));
          } catch (e) {
            receta = { mensaje: "Error al analizar la receta." };
          }

          return (
            <div key={item.id} className="border rounded-2xl p-4 shadow-md bg-white">
              <p className="text-sm text-gray-500">
                Fecha: {new Date(item.created_at).toLocaleString()}
              </p>
              <p className="text-sm italic text-gray-600 mb-2">Transcripción: {item.transcript}</p>
              {receta?.mensaje ? (
                <p className="text-red-600">{receta.mensaje}</p>
              ) : (
                <>
                  <h2 className="text-xl font-semibold">{receta.nombre}</h2>
                  <div className="mt-2">
                    <h3 className="font-semibold">Ingredientes:</h3>
                    <ul className="list-disc list-inside">
                      {receta.ingredientes?.map((ing: any, index: number) => (
                        <li key={index}>{ing.nombre} – {ing.cantidad}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-2">
                    <h3 className="font-semibold">Preparación:</h3>
                    <ol className="list-decimal list-inside">
                      {receta.preparacion?.map((paso: string, index: number) => (
                        <li key={index}>{paso}</li>
                      ))}
                    </ol>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    )}
  </div>
</TabsContent>

      </Tabs>
    </MainLayout>
  );
}

function setIsLoading(arg0: boolean) {
  throw new Error("Function not implemented.");
}