"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Camera, Upload, Send, RefreshCw, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MainLayout } from "@/components/layout/main-layout";
import { logExercise } from "@/services/img_maquinas/img_maquinas";
export default function GymEquipmentIdentifier() {
  const [image, setImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [equipmentData, setEquipmentData] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    setSelectedFile(file); // <-- Aquí guardamos el archivo
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string); // Para mostrar preview
      if (isCameraActive) stopCamera();
    };
    reader.readAsDataURL(file);
  }
};

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsCameraActive(true)
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
      setIsCameraActive(false)
    }
  }

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d")
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)

        const imageDataUrl = canvasRef.current.toDataURL("image/png")
        setImage(imageDataUrl)
        stopCamera()
      }
    }
  }

 
  const resetForm = () => {
    setImage(null)
    setEquipmentData(null)
    setShowResults(false)
    if (fileInputRef.current) fileInputRef.current.value = ""
    if (isCameraActive) stopCamera()
  }

  const downloadImage = () => {
    if (image) {
      const a = document.createElement("a")
      a.href = image
      a.download = "gym-equipment.png"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  const sendImage = async () => {
    if (!selectedFile) return;
    setIsLoading(true);
    setErrorMessage(null); // limpiamos mensaje anterior
  
    const userData = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : null;
    const googleId = userData.id;
  
    try {
      const response = await logExercise(googleId, selectedFile);
      const parsedData = {
        ...response,
        maquina_data: JSON.parse(response.maquina_data.replace(/'/g, '"'))
      };
      console.log("parsedData", parsedData)
      setEquipmentData(parsedData);
      setShowResults(true);
    } catch (err: any) {
      console.error("❌ Error en el backend:", err);
      setErrorMessage("use client");
    }
  
    setIsLoading(false);
  };
  
  

  return (    
    <MainLayout>
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Identificador de Máquinas de Gimnasio</h1>

      <div className="max-w-3xl mx-auto bg-card rounded-lg shadow-lg p-6 flex flex-col items-center text-center">

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Sube o toma una foto de la máquina</h2>
          {errorMessage && (
            <div className="text-red-600 text-center mb-4 font-semibold">
              {errorMessage}
            </div>
          )}
          <div className="flex flex-wrap gap-4 mb-6">
            <Button onClick={startCamera} disabled={isCameraActive}>
              <Camera className="mr-2 h-4 w-4" />
              Tomar Foto
            </Button>
            <Button onClick={() => fileInputRef.current?.click()} variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Subir Imagen
            </Button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
          </div>

          {isCameraActive && (
            <div className="relative mb-4">
              <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg border border-border" />
              <Button onClick={captureImage} className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                Capturar
              </Button>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />

          {image && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Vista previa:</h3>
              <div className="relative w-full max-w-md mx-auto">
                <img
                  src={image || "/placeholder.svg"}
                  alt="Vista previa de la máquina"
                  className="w-[400px] h-[300px] object-contain rounded-lg border border-border"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <Button onClick={sendImage} disabled={!image || isLoading} className="min-w-[120px]">
            {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            Enviar Imagen
          </Button>

          <Button onClick={resetForm} variant="outline" className="min-w-[120px]">
            <RefreshCw className="mr-2 h-4 w-4" />
            Resetear
          </Button>

          <Button onClick={downloadImage} variant="outline" disabled={!image} className="min-w-[120px]">
            <Download className="mr-2 h-4 w-4" />
            Descargar Imagen
          </Button>
        </div>
      </div>

      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Información de la Máquina</DialogTitle>
            <DialogDescription>Detalles sobre la máquina de gimnasio identificada</DialogDescription>
          </DialogHeader>

          {equipmentData && (
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <img
                  src={image || ""}
                  alt="Máquina de gimnasio"
                  className="w-[400px] h-[300px] object-contain rounded-lg border border-border"
                />
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>{equipmentData?.maquina_data?.nombre_maquina || "Banco de Peso"}</CardTitle>
                  <CardDescription>
                      Nivel de riesgo:{" "}
                      <span className="font-medium text-destructive">{equipmentData?.maquina_data?.riesgo || "Alto"}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-1">Uso:</h4>
                      <p>{equipmentData?.maquina_data?.uso || "Ejercicios para pecho"}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-1">Series recomendadas:</h4>
                      <p>{equipmentData?.maquina_data?.series_recomendadas || "3-4 series de 10 repeticiones"}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-1">Músculos trabajados:</h4>
                      <p>{equipmentData?.maquina_data?.musculos_trabajados || "Pecho, Tríceps, Hombros"}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-1">Descripción:</h4>
                      <p className="text-sm">
                        {equipmentData?.maquina_data?.descripcion ||
                          "Un banco de peso es una máquina de entrenamiento que permite realizar ejercicios para desarrollar la fuerza y la masa muscular de los músculos del pecho, tríceps y hombros."}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-1">Estado:</h4>
                      <p>{equipmentData?.maquina_data?.estado || "Sin daño"}</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => setShowResults(false)} className="w-full">
                      Cerrar
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
    </MainLayout>
  )
}
