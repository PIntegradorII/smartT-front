import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "./login/providers";
import { LoadingProvider } from "@/app/context/LoadingContext"; // Importa el Provider correctamente
import Loading from "@/components/ui/loading"; // Importa el componente Loading

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SmartTrainer - Tu aplicación de fitness",
  description: "Aplicación de fitness personalizada con IA",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <LoadingProvider> {/* 🛠️ Asegura que LoadingProvider envuelve todo */}
              {children}
              <Loading /> {/* 🔄 Loading dentro del Provider */}
            </LoadingProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
