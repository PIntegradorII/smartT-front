"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import Image from "next/image"

export default function RutinaPage() {
  const [activeDay, setActiveDay] = useState(3)

  // Exercise data
  const exercises = [
    {
      id: 1,
      name: "Forward Lunge",
      sets: 4,
      time: "30 Sec",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-FKy7c5J0LawecPTS7ljEPz5NnnunCi.svg",
      status: "completed",
    },
    {
      id: 2,
      name: "Forward Lunge",
      sets: 4,
      time: "30 Sec",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-ZPGHkWpLUBI1DmKwJLgyDJEeHQKoSa.svg",
      status: "completed",
    },
    {
      id: 3,
      name: "Forward Lunge",
      sets: 4,
      time: "30 Sec",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3-b9yiNDxG3LRIQ7JTfhxFa6cT3sprsh.svg",
      status: "not-started",
    },
    {
      id: 4,
      name: "Side Plank",
      sets: 3,
      time: "45 Sec",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4-qQbFkbf3E6kGxk2YvHPXjGdwEi2EAe.svg",
      status: "not-started",
    },
    {
      id: 5,
      name: "Warrior Pose",
      sets: 3,
      time: "60 Sec",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5-KEFBcm8gjuBxYiZqq197JoHWxBd2jm.svg",
      status: "not-started",
    },
    {
      id: 6,
      name: "Bow Pose",
      sets: 3,
      time: "30 Sec",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6-NTb3BXPtnhakIDBH30N2rK3Hq4QNja.svg",
      status: "not-started",
    },
  ]

  // Filter exercises for the active day (in a real app, this would be more dynamic)
  const dayExercises = exercises.filter((_, index) => {
    if (activeDay === 1) return index < 3
    if (activeDay === 2) return index >= 1 && index < 4
    if (activeDay === 3) return index >= 0 && index < 3
    if (activeDay === 4) return index >= 2 && index < 5
    if (activeDay === 5) return index >= 3 && index < 6
    return false
  })

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Tu rutina de entrenamiento</h1>
          <p className="text-muted-foreground">Personalizada según tus objetivos y condición física.</p>
        </div>

        {/* Day selector */}
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((day) => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`rounded-full px-6 py-2 text-sm font-medium transition-colors ${
                activeDay === day
                  ? "bg-primary text-white"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Day {day}
            </button>
          ))}
        </div>

        {/* Exercise cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dayExercises.map((exercise) => (
            <div key={exercise.id} className="border rounded-lg overflow-hidden bg-white">
              <div className="p-4 flex flex-col items-center">
                <div className="w-full h-48 relative mb-4">
                  <Image
                    src={exercise.image || "/placeholder.svg"}
                    alt={exercise.name}
                    fill
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <h3 className="text-lg font-semibold text-center mb-1">{exercise.name}</h3>
                <div className="text-sm text-gray-500 text-center mb-1">Sets - {exercise.sets}</div>
                <div className="text-sm text-gray-500 text-center mb-4">Time - {exercise.time}</div>

                <div className="w-full h-2 mb-2">
                  <div
                    className={
                      exercise.status === "completed"
                        ? "exercise-progress-completed w-full"
                        : "exercise-progress-not-started w-full"
                    }
                  />
                </div>
                <div className="text-sm font-medium text-center">
                  {exercise.status === "completed" ? "Completed" : "Not Started"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  )
}

