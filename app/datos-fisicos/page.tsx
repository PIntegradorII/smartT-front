"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dumbbell } from "lucide-react"

export default function DatosFisicosPage() {
  const [step, setStep] = useState(1)

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
              <div key={i} className={`w-1/3 h-2 rounded-full mx-1 ${i <= step ? "bg-primary" : "bg-muted"}`} />
            ))}
          </div>
          <div className="text-center text-sm text-muted-foreground">
            Paso {step} de 3: {step === 1 ? "Datos físicos" : step === 2 ? "Objetivos" : "Condiciones médicas"}
          </div>
        </div>

        {step === 1 && (
          <Card className="w-full shadow-lg">
            <CardHeader>
              <CardTitle>Datos físicos</CardTitle>
              <CardDescription>Ingresa tus datos físicos para personalizar tu experiencia</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edad">Edad</Label>
                <Input id="edad" type="number" placeholder="30" />
              </div>

              <div className="space-y-2">
                <Label>Género</Label>
                <RadioGroup defaultValue="masculino" className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="masculino" id="masculino" />
                    <Label htmlFor="masculino">Masculino</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="femenino" id="femenino" />
                    <Label htmlFor="femenino">Femenino</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="otro" id="otro" />
                    <Label htmlFor="otro">Otro</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="altura">Altura (cm)</Label>
                  <Input id="altura" type="number" placeholder="175" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="peso">Peso (kg)</Label>
                  <Input id="peso" type="number" placeholder="70" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nivel-actividad">Nivel de actividad física</Label>
                <Select>
                  <SelectTrigger id="nivel-actividad">
                    <SelectValue placeholder="Selecciona tu nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentario">Sedentario (poco o nada de ejercicio)</SelectItem>
                    <SelectItem value="ligero">Ligero (ejercicio 1-3 días/semana)</SelectItem>
                    <SelectItem value="moderado">Moderado (ejercicio 3-5 días/semana)</SelectItem>
                    <SelectItem value="activo">Activo (ejercicio 6-7 días/semana)</SelectItem>
                    <SelectItem value="muy-activo">Muy activo (ejercicio intenso diario)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => setStep(2)}>
                Continuar
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 2 && (
          <Card className="w-full shadow-lg">
            <CardHeader>
              <CardTitle>Objetivos de entrenamiento</CardTitle>
              <CardDescription>Selecciona tus objetivos para personalizar tu rutina</CardDescription>
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
                    <SelectItem value="ganar-musculo">Ganar masa muscular</SelectItem>
                    <SelectItem value="tonificar">Tonificar el cuerpo</SelectItem>
                    <SelectItem value="resistencia">Mejorar resistencia</SelectItem>
                    <SelectItem value="fuerza">Aumentar fuerza</SelectItem>
                    <SelectItem value="flexibilidad">Mejorar flexibilidad</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="frecuencia">Frecuencia de entrenamiento semanal</Label>
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
                <Label htmlFor="duracion">Duración preferida de entrenamiento</Label>
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
                    <SelectItem value="ninguno">Sin equipamiento (en casa)</SelectItem>
                    <SelectItem value="basico">Equipamiento básico (mancuernas, bandas)</SelectItem>
                    <SelectItem value="gimnasio">Acceso a gimnasio completo</SelectItem>
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
          <Card className="w-full shadow-lg">
            <CardHeader>
              <CardTitle>Condiciones médicas</CardTitle>
              <CardDescription>Información importante para adaptar tu rutina a tus necesidades</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="condiciones">¿Tienes alguna condición médica?</Label>
                <Select>
                  <SelectTrigger id="condiciones">
                    <SelectValue placeholder="Selecciona una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No tengo condiciones médicas</SelectItem>
                    <SelectItem value="si">Sí, tengo condiciones médicas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="detalles">Detalles de condiciones médicas (opcional)</Label>
                <textarea
                  id="detalles"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Describe cualquier condición médica, lesión o limitación que debamos tener en cuenta"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lesiones">¿Tienes alguna lesión o área problemática?</Label>
                <Select>
                  <SelectTrigger id="lesiones">
                    <SelectValue placeholder="Selecciona una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No tengo lesiones</SelectItem>
                    <SelectItem value="espalda">Problemas de espalda</SelectItem>
                    <SelectItem value="rodillas">Problemas de rodillas</SelectItem>
                    <SelectItem value="hombros">Problemas de hombros</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="confirmacion"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="confirmacion">
                    Confirmo que la información proporcionada es correcta y que consultaré con un médico antes de
                    comenzar cualquier programa de ejercicio.
                  </Label>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                Atrás
              </Button>
              <Link href="/dashboard">
                <Button>Finalizar</Button>
              </Link>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}

