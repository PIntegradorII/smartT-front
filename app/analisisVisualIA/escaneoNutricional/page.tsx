"use client"

import { useState, useRef } from "react"
import { Camera, Upload, Send, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MainLayout } from "@/components/layout/main-layout"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { SendBarcode } from "@/services/barcode/barcode_service"
import { getID } from "@/services/login/authService"

export default function EscaneoNutricional() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setErrorMessage(null)
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setIsCameraActive(true)
      setErrorMessage(null)
    } catch (err) {
      console.error("No se pudo acceder a la cámara:", err)
      setErrorMessage("No se pudo acceder a la cámara.")
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
    setIsCameraActive(false)
  }

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d")
      canvasRef.current.width = videoRef.current.videoWidth
      canvasRef.current.height = videoRef.current.videoHeight
      ctx?.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
      const imageDataUrl = canvasRef.current.toDataURL("image/png")
      setImagePreview(imageDataUrl)

      // Convertir a File
      fetch(imageDataUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "captured.png", { type: "image/png" })
          setSelectedFile(file)
        })

      stopCamera()
    }
  }

  const sendImageToBackend = async () => {
    if (!selectedFile) return

    setIsLoading(true)
    setErrorMessage(null)

    try {
      const userData = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user") as string)
        : null

      if (userData && userData.id) {
        const userId = await getID(userData.id)
        const data = await SendBarcode(selectedFile, userId)
        setResult(data)
      } else {
        setErrorMessage("No se encontró el usuario.")
      }
    } catch (error: any) {
      if (error?.response?.data?.detail) {
        setErrorMessage(`Error: ${error.response.data.detail}`)
      } else {
        setErrorMessage("Ocurrió un error inesperado al enviar la imagen.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setSelectedFile(null)
    setImagePreview(null)
    setResult(null)
    setErrorMessage(null)
    setIsCameraActive(false)
    if (fileInputRef.current) fileInputRef.current.value = ""
    stopCamera()
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Escaneo Nutricional</h1>

        <div className="max-w-3xl mx-auto bg-card rounded-lg shadow-lg p-6 flex flex-col items-center text-center">
          <h2 className="text-xl font-semibold mb-4">Sube o toma una foto del código de barras del alimento</h2>

          {errorMessage && (
            <p className="text-red-600 bg-red-100 border border-red-300 px-4 py-2 rounded-md font-medium mb-4">
              {errorMessage}
            </p>
          )}

          <div className="flex gap-4 mb-6 justify-center">
            <Button onClick={startCamera} disabled={isCameraActive}>
              <Camera className="mr-2 h-4 w-4" />
              Tomar Foto
            </Button>
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
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

          {imagePreview && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Vista previa:</h3>
              <img
                src={imagePreview}
                alt="Vista previa del código de barras"
                className="w-[400px] h-[300px] object-contain rounded-lg border border-border"
              />
            </div>
          )}

          <div className="flex flex-wrap gap-4 justify-center">
            {!result && (
              <Button onClick={sendImageToBackend} disabled={!selectedFile || isLoading} className="min-w-[120px]">
                {isLoading ? "Procesando..." : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Enviar Imagen
                  </>
                )}
              </Button>
            )}
            <Button variant="outline" onClick={resetForm} className="min-w-[120px]">
              <RefreshCw className="mr-2 h-4 w-4" />
              Resetear
            </Button>
          </div>

          {result && !result.error && (
            <div className="mt-8 w-full grid md:grid-cols-2 gap-6 text-left">
              <div>
                <h3 className="text-xl font-semibold mb-2">Resumen Nutricional</h3>
                <table className="w-full text-sm border border-border rounded-md overflow-hidden">
                  <tbody>
                    {Object.entries(result.resumen || {}).map(([key, value]) => (
                      <tr key={key}>
                        <td className="p-2 capitalize text-muted-foreground">{key.replace(/_/g, " ")}</td>
                        <td className="p-2">{String(value)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="mt-4">Ver más</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Tabla Nutricional Completa</DialogTitle>
                    </DialogHeader>
                    <div className="overflow-x-auto max-h-[70vh]">
                      <table className="w-full text-sm border border-border rounded-md overflow-hidden">
                        <tbody>
                          {Object.entries(result.nutrientes || {}).map(([key, value]) => (
                            <tr key={key}>
                              <td className="p-2 font-semibold text-muted-foreground">{key.replace(/_/g, " ")}</td>
                              <td className="p-2">{String(value)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Análisis por IA</h3>
                {result.analisis_ia ? (
                  <p className="bg-muted p-4 rounded-lg whitespace-pre-line text-sm">
                    {result.analisis_ia}
                  </p>
                ) : (
                  <p className="text-muted-foreground italic">El análisis por IA no está disponible actualmente.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
