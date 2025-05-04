"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
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
      // Validar que el archivo sea una imagen
      if (!file.type.startsWith("image/")) {
        setErrorMessage("El archivo seleccionado no es una imagen.");
        return;
      }

      // Validar el tamaño del archivo (limitar a 5MB, por ejemplo)
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("El archivo es demasiado grande. El tamaño máximo permitido es 5MB.");
        return;
      }

      setSelectedFile(file);
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
      setIsCameraActive(true)
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
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
      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

        const imageDataUrl = canvasRef.current.toDataURL("image/png");
        setImage(imageDataUrl);
        stopCamera();

        // Convertir el DataURL en un blob
        fetch(imageDataUrl)
          .then((res) => res.blob())
          .then((blob) => {
            const file = new File([blob], "captured.png", { type: "image/png" });
            setSelectedFile(file);     // Asignamos el archivo para el envío
            sendImage();               // Enviamos la imagen al backend
          });
      }
    }
  };
  


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
    setErrorMessage(null); // Limpiar mensaje anterior

    // Verificar si la imagen tiene contenido
    const img = new Image();
    img.onload = async () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const pixels = imageData.data;

        let isImageEmpty = true;
        for (let i = 0; i < pixels.length; i += 4) {
          // Si encontramos un píxel no negro, consideramos que hay contenido en la imagen
          if (pixels[i] !== 0 || pixels[i + 1] !== 0 || pixels[i + 2] !== 0) {
            isImageEmpty = false;
            break;
          }
        }

        if (isImageEmpty) {
          setErrorMessage("La imagen está vacía o no contiene una máquina válida.");
          setIsLoading(false);
          return;
        }

        // Procedemos con la lógica de envío si la imagen es válida
        const userData = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : null;
        const googleId = userData?.id;

        try {
          const response = await logExercise(googleId, selectedFile);
          console.log("response", response)
          const parsedData = {
            ...response,
            maquina_data: JSON.parse(response.maquina_data.replace(/'/g, '"'))
          };
          setEquipmentData(parsedData);
          setShowResults(true);
        } catch (err) {
          console.error("Error en el backend:", err);
          setErrorMessage("Error al procesar la imagen.");
        }
      }
      setIsLoading(false);
    };

    img.onerror = () => {
      setErrorMessage("Error al cargar la imagen.");
      setIsLoading(false);
    };

    img.src = image || ''; // Cargar la imagen para verificar su contenido
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
              <Button
                onClick={() => {
                  setIsCameraActive(false);           // Desactiva la cámara
                  fileInputRef.current?.click();      // Simula clic en el input de archivo
                }}
                variant="outline"
              >
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
