"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle } from "lucide-react"
import { getWeeklyExercises } from "@/services/resumen/resumen"

interface WeekdayStatus {
  day: string
  completed: boolean
  date: string
}

export default function WeeklyCalendarAlt({ refresh }: { refresh: boolean }) {
  const [weekData, setWeekData] = useState<WeekdayStatus[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false) // Estado para manejar errores

  const loadData = async () => {
    setIsLoading(true)
    setError(false)

    try {
      const userData = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : null
      if (userData) {
        const googleId = userData.id
        const data = await getWeeklyExercises(googleId)

        // Verifica si la respuesta es válida
        if (Array.isArray(data)) {
          setWeekData(data)
        } else {
          setWeekData([])
          setError(true) // Marca error si la respuesta no es la esperada
        }
      } else {
        setError(true) // Si no hay usuario, marcar error
      }
    } catch (error) {
      console.error("Error al cargar el resumen semanal:", error)
      setError(true) // En caso de error, mostrar mensaje
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [refresh])

  const completedDays = weekData.filter((day) => day.completed).length

  return (
    <Card className="w-full shadow-md border border-gray-200">
      <CardHeader className="pb-2 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">Resumen Semanal</CardTitle>
          <Badge className="bg-gradient-to-r from-red-600 to-black text-white">
            {completedDays} de {weekData.length} días
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-pulse w-full space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-20 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ) : error || weekData.length === 0 ? (
          <p className="text-center text-gray-500">No hay datos disponibles</p>
        ) : (
          <div className="grid grid-cols-7 gap-2">
            {weekData.map((day, index) => (
              <div key={index} className="flex flex-col items-center">
                <span className="text-xs font-medium text-gray-700 mb-1">{day.day.substring(0, 3)}</span>
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm
                    ${day.completed ? "bg-gradient-to-br from-red-500 via-red-600 to-black text-white" : "bg-gray-200 text-gray-400"}
                  `}
                >
                  {day.completed ? <CheckCircle className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
                </div>
                <span className="text-xs mt-1 text-center text-gray-600">{day.date.split(" ")[0]}</span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium">Progreso semanal</span>
            <span className="font-bold">{weekData.length > 0 ? Math.round((completedDays / weekData.length) * 100) : 0}%</span>
          </div>
          <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-500 via-red-600 to-black transition-all duration-500 ease-in-out"
              style={{ width: `${weekData.length > 0 ? (completedDays / weekData.length) * 100 : 0}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
