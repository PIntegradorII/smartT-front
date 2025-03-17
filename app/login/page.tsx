"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dumbbell } from "lucide-react"
import { useAuth } from "@/app/login/providers"

export default function LoginForm() {
  const { signInWithGoogle, isLoading } = useAuth()

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F5F5F5]">
      <Card className="w-full max-w-md shadow-xl bg-white">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-black">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">FitPro</CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Tu compañero de entrenamiento personal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-4 md:p-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Image
              src={require("@/public/images/login_img.jpg")}
              alt="Fitness motivation"
              width={400}
              height={200}
              priority 
              className="rounded-lg object-cover max-w-full h-auto"
            />
            <p className="text-center text-gray-600">
              Accede a tus rutinas personalizadas, seguimiento de progreso y más
            </p>
          </div>
          <Button
            onClick={signInWithGoogle}
            className="w-full h-12 bg-white hover:bg-gray-100 text-black flex items-center justify-center gap-2 border"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-purple-600 border-t-transparent"></div>
                <span>Iniciando sesión...</span>
              </div>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span>Continuar con Google</span>
              </>
            )}
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-gray-600">
          Al iniciar sesión, aceptas nuestros términos y condiciones
        </CardFooter>
      </Card>
    </div>
  )
}
